package com.careerai.app

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.ViewGroup
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import androidx.webkit.WebViewAssetLoader
import com.careerai.app.data.api.ApiClient
import com.careerai.app.data.storage.SecureTokenManager
import com.careerai.app.ui.theme.BgDark
import com.careerai.app.ui.theme.CareerAITheme

class MainActivity : ComponentActivity() {
    private lateinit var tokenManager: SecureTokenManager
    private var filePathCallback: ValueCallback<Array<Uri>>? = null
    private var webViewRef: WebView? = null

    private val fileChooserLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (filePathCallback != null) {
            val intentData = result.data
            val results: Array<Uri>? = if (result.resultCode == RESULT_OK && intentData != null) {
                val dataString = intentData.dataString
                val clipData = intentData.clipData
                if (clipData != null) {
                    Array(clipData.itemCount) { i -> clipData.getItemAt(i).uri }
                } else if (dataString != null) {
                    arrayOf(Uri.parse(dataString))
                } else null
            } else null
            filePathCallback?.onReceiveValue(results)
            filePathCallback = null
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        ApiClient.init(applicationContext)
        tokenManager = SecureTokenManager(applicationContext)

        setContent {
            CareerAITheme {
                Surface(modifier = Modifier.fillMaxSize(), color = BgDark) {
                    ArjAppWebView(
                        onSetupWebView = { webView ->
                            webViewRef = webView
                        },
                        onOpenFileChooser = { callback, params ->
                            filePathCallback?.onReceiveValue(null)
                            filePathCallback = callback
                            val intent = params?.createIntent()
                            try {
                                fileChooserLauncher.launch(intent ?: Intent(Intent.ACTION_GET_CONTENT).apply {
                                    addCategory(Intent.CATEGORY_OPENABLE)
                                    type = "*/*"
                                })
                            } catch (e: Exception) {
                                filePathCallback = null
                            }
                        }
                    )
                }
            }
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (webViewRef?.canGoBack() == true) {
            webViewRef?.goBack()
        } else {
            super.onBackPressed()
        }
    }
}

@Composable
fun ArjAppWebView(
    onSetupWebView: (WebView) -> Unit,
    onOpenFileChooser: (ValueCallback<Array<Uri>>?, WebChromeClient.FileChooserParams?) -> Unit
) {
    AndroidView(
        modifier = Modifier.fillMaxSize(),
        factory = { context ->
            WebView.setWebContentsDebuggingEnabled(true)
            val assetLoader = WebViewAssetLoader.Builder()
                .setDomain("appassets.androidplatform.net")
                .addPathHandler("/", WebViewAssetLoader.AssetsPathHandler(context))
                .build()

            WebView(context).apply {
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )

                settings.apply {
                    javaScriptEnabled = true
                    domStorageEnabled = true
                    databaseEnabled = true
                    allowFileAccess = true
                    allowContentAccess = true
                    allowFileAccessFromFileURLs = true
                    allowUniversalAccessFromFileURLs = true
                    loadWithOverviewMode = true
                    useWideViewPort = true
                    mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                    setSupportZoom(false)
                }

                webViewClient = object : WebViewClient() {
                    override fun shouldInterceptRequest(
                        view: WebView?,
                        request: WebResourceRequest?
                    ): WebResourceResponse? {
                        request?.url?.let { uri ->
                            val response = assetLoader.shouldInterceptRequest(uri)
                            if (response != null) return response
                        }
                        return super.shouldInterceptRequest(view, request)
                    }

                    override fun shouldOverrideUrlLoading(
                        view: WebView?,
                        request: WebResourceRequest?
                    ): Boolean {
                        val url = request?.url?.toString() ?: return false
                        if (url.startsWith("http://") || url.startsWith("https://")) {
                            if (url.contains("appassets.androidplatform.net") || url.contains("localhost") || url.contains("10.0.2.2")) {
                                return false
                            }
                            try {
                                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                                context.startActivity(intent)
                                return true
                            } catch (e: Exception) {
                                return false
                            }
                        }
                        return false
                    }
                }

                webChromeClient = object : WebChromeClient() {
                    override fun onShowFileChooser(
                        webView: WebView?,
                        filePathCallback: ValueCallback<Array<Uri>>?,
                        fileChooserParams: FileChooserParams?
                    ): Boolean {
                        onOpenFileChooser(filePathCallback, fileChooserParams)
                        return true
                    }
                }

                onSetupWebView(this)
                loadUrl("https://appassets.androidplatform.net/index.html")
            }
        }
    )
}
