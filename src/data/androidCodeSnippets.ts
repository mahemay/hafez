export interface CodeFile {
  id: string;
  filename: string;
  path: string;
  language: string;
  category: 'step1' | 'step2' | 'step3' | 'step4' | 'step5';
  title: string;
  description: string;
  code: string;
}

export const PROJECT_STRUCTURE = `FalEHafez/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── assets/
│   │   │   │   └── hafez.json              <-- 100% Offline Ghazal & Tafsir Database
│   │   │   ├── java/com/hafez/fal/
│   │   │   │   ├── data/
│   │   │   │   │   ├── datasource/
│   │   │   │   │   │   └── HafezAssetDataSource.kt   <-- Coroutine-safe JSON Asset Reader
│   │   │   │   │   ├── model/
│   │   │   │   │   │   └── HafezPoem.kt              <-- Moshi / Gson Data Class
│   │   │   │   │   └── repository/
│   │   │   │   │       └── HafezRepositoryImpl.kt    <-- Clean Architecture Implementation
│   │   │   │   ├── domain/
│   │   │   │   │   ├── model/
│   │   │   │   │   │   └── FalResult.kt              <-- Domain Business Entity
│   │   │   │   │   ├── repository/
│   │   │   │   │   │   └── HafezRepository.kt        <-- Repository Interface (Flow / Suspend)
│   │   │   │   │   └── usecase/
│   │   │   │   │       ├── GetRandomFalUseCase.kt    <-- Non-Repeating Random Selection Logic
│   │   │   │   │       └── GetAllGhazalsUseCase.kt
│   │   │   │   ├── presentation/
│   │   │   │   │   ├── navigation/
│   │   │   │   │   │   └── HafezNavGraph.kt          <-- Jetpack Navigation Compose
│   │   │   │   │   ├── screens/
│   │   │   │   │   │   ├── splash/
│   │   │   │   │   │   │   └── SplashScreen.kt       <-- Persian Motif & Auto-Transition
│   │   │   │   │   │   ├── home/
│   │   │   │   │   │   │   └── HomeScreen.kt         <-- Persian Tazhib & "نیت و فال"
│   │   │   │   │   │   ├── niyat/
│   │   │   │   │   │   │   └── NiyatScreen.kt        <-- Contemplation & "گشودن کتاب"
│   │   │   │   │   │   ├── loading/
│   │   │   │   │   │   │   └── BookOpeningScreen.kt  <-- 3D Book & Incense Smoke Transition
│   │   │   │   │   │   └── result/
│   │   │   │   │   │       └── ResultScreen.kt       <-- Nastaliq Poem, Tafsir, Share & Repeat
│   │   │   │   │   ├── theme/
│   │   │   │   │   │   ├── Color.kt                  <-- Deep Navy, Turquoise, Persian Gold
│   │   │   │   │   │   ├── Type.kt                   <-- Vazirmatn Persian Typography
│   │   │   │   │   │   └── Theme.kt                  <-- Material 3 & Strict RTL Setup
│   │   │   │   │   └── viewmodel/
│   │   │   │   │       ├── FalUiState.kt             <-- Sealed UI State Architecture
│   │   │   │   │       └── FalViewModel.kt           <-- StateFlow & Coroutines Management
│   │   │   │   └── MainActivity.kt               <-- Single-Activity Entry Point
│   │   │   ├── res/
│   │   │   │   ├── font/
│   │   │   │   │   ├── vazirmatn_regular.ttf     <-- Persian Font Asset
│   │   │   │   │   └── vazirmatn_bold.ttf
│   │   │   │   └── drawable/
│   │   │   │       └── ic_tazhib_ornament.xml
│   │   │   └── AndroidManifest.xml
│   └── build.gradle.kts                          <-- Dependencies & Compose Compiler
└── build.gradle.kts`;

export const CODE_FILES: CodeFile[] = [
  // STEP 1: Data Models
  {
    id: 'hafez-poem-model',
    filename: 'HafezPoem.kt',
    path: 'app/src/main/java/com/hafez/fal/data/model/HafezPoem.kt',
    language: 'kotlin',
    category: 'step1',
    title: '1. Data Model (Moshi & Gson Compatible)',
    description: 'Kotlin data class mapped directly to assets/hafez.json. Annotated for both Moshi and Gson with verse formatting helper functions.',
    code: `package com.hafez.fal.data.model

import com.google.gson.annotations.SerializedName
import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

/**
 * Data model representing a Hafez Ghazal matching the assets/hafez.json structure.
 * Supports both Moshi (preferred for Kotlin) and Gson.
 */
@JsonClass(generateAdapter = true)
data class HafezPoem(
    @Json(name = "ghazal_number")
    @SerializedName("ghazal_number")
    val ghazalNumber: Int,

    @Json(name = "poem")
    @SerializedName("poem")
    val poem: String,

    @Json(name = "tafsir")
    @SerializedName("tafsir")
    val tafsir: String
) {
    /**
     * Splits raw poem text into structured couplets (Beit = Mesra 1 + Mesra 2).
     */
    fun parseCouplets(): List<Couplet> {
        val lines = poem.trim().lines().filter { it.isNotBlank() }
        val couplets = mutableListOf<Couplet>()
        
        var i = 0
        while (i < lines.size) {
            val first = lines[i].trim()
            val second = if (i + 1 < lines.size) lines[i + 1].trim() else ""
            couplets.add(Couplet(firstMesra = first, secondMesra = second))
            i += 2
        }
        return couplets
    }
}

/**
 * Represents a single Persian poetic couplet (بیت).
 */
data class Couplet(
    val firstMesra: String,
    val secondMesra: String
)`
  },
  {
    id: 'fal-ui-state',
    filename: 'FalUiState.kt',
    path: 'app/src/main/java/com/hafez/fal/presentation/viewmodel/FalUiState.kt',
    language: 'kotlin',
    category: 'step1',
    title: '1. UI State Hierarchy (Sealed Interface)',
    description: 'Unidirectional Data Flow (UDF) state representing Idle, Contemplation (Niyat), Animating, and Success.',
    code: `package com.hafez.fal.presentation.viewmodel

import com.hafez.fal.data.model.HafezPoem

/**
 * Robust sealed interface for representing the Fal-e Hafez UI State.
 * Ensures unidirectional data flow (UDF) without inconsistent intermediate states.
 */
sealed interface FalUiState {
    // Initial Home state
    object Idle : FalUiState

    // User is in contemplation on the Niyat screen
    object Contemplating : FalUiState

    // Opening book / incense smoke loading animation (duration ~2.5s)
    object OpeningBook : FalUiState

    // Successfully retrieved and parsed Fal result
    data class Success(
        val poem: HafezPoem,
        val isBookmarked: Boolean = false,
        val openedTimestamp: Long = System.currentTimeMillis()
    ) : FalUiState

    // Error state (e.g. Asset read failure)
    data class Error(val message: String) : FalUiState
}

/**
 * User Intent / Events sent to FalViewModel
 */
sealed interface FalEvent {
    object StartNiyat : FalEvent
    object OpenBookAndRevealFal : FalEvent
    object RepeatFal : FalEvent
    object ToggleBookmark : FalEvent
    object ResetToHome : FalEvent
}`
  },

  // STEP 2: JSON Parser, Repository, ViewModel
  {
    id: 'asset-data-source',
    filename: 'HafezAssetDataSource.kt',
    path: 'app/src/main/java/com/hafez/fal/data/datasource/HafezAssetDataSource.kt',
    language: 'kotlin',
    category: 'step2',
    title: '2. Offline JSON Asset Parser (Moshi & Gson)',
    description: 'Efficient local JSON reader with I/O Coroutine dispatcher and caching to avoid repeated disk reads.',
    code: `package com.hafez.fal.data.datasource

import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.hafez.fal.data.model.HafezPoem
import com.squareup.moshi.Moshi
import com.squareup.moshi.Types
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.InputStreamReader

/**
 * Offline Asset Data Source:
 * Reads and parses assets/hafez.json on Dispatchers.IO.
 * In-memory caching ensures instantaneous subsequent accesses.
 */
class HafezAssetDataSource(private val context: Context) {

    private var cachedGhazals: List<HafezPoem>? = null

    /**
     * Preferred Moshi Implementation (Reflective/Codegen, safe nullability)
     */
    suspend fun loadGhazalsWithMoshi(): List<HafezPoem> = withContext(Dispatchers.IO) {
        cachedGhazals?.let { return@withContext it }

        val moshi = Moshi.Builder()
            .add(KotlinJsonAdapterFactory())
            .build()
        val type = Types.newParameterizedType(List::class.java, HafezPoem::class.java)
        val adapter = moshi.adapter<List<HafezPoem>>(type)

        val jsonString = context.assets.open("hafez.json").bufferedReader().use { it.readText() }
        val result = adapter.fromJson(jsonString) ?: emptyList()
        cachedGhazals = result
        result
    }

    /**
     * Alternative Gson Implementation
     */
    suspend fun loadGhazalsWithGson(): List<HafezPoem> = withContext(Dispatchers.IO) {
        cachedGhazals?.let { return@withContext it }

        val gson = Gson()
        val inputStream = context.assets.open("hafez.json")
        val reader = InputStreamReader(inputStream)
        val type = object : TypeToken<List<HafezPoem>>() {}.type
        
        val result: List<HafezPoem> = reader.use { gson.fromJson(it, type) }
        cachedGhazals = result
        result
    }
}`
  },
  {
    id: 'repository',
    filename: 'HafezRepository.kt',
    path: 'app/src/main/java/com/hafez/fal/domain/repository/HafezRepository.kt',
    language: 'kotlin',
    category: 'step2',
    title: '2. Clean Architecture Repository',
    description: 'Interface and Implementation providing non-repeating random selection and Flow streams.',
    code: `package com.hafez.fal.domain.repository

import com.hafez.fal.data.datasource.HafezAssetDataSource
import com.hafez.fal.data.model.HafezPoem
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import java.util.LinkedList
import kotlin.random.Random

interface HafezRepository {
    suspend fun getRandomFal(): HafezPoem
    suspend fun getAllGhazals(): List<HafezPoem>
    fun getGhazalByNumber(number: Int): Flow<HafezPoem?>
}

class HafezRepositoryImpl(
    private val dataSource: HafezAssetDataSource
) : HafezRepository {

    // Ring-buffer queue to prevent repeating recently shown poems (last 5)
    private val recentGhazalIds = LinkedList<Int>()
    private val historySizeLimit = 5

    override suspend fun getRandomFal(): HafezPoem {
        val allGhazals = dataSource.loadGhazalsWithMoshi()
        if (allGhazals.isEmpty()) {
            throw IllegalStateException("hafez.json contains no records.")
        }

        // Filter out recently selected ghazals if possible
        val available = if (allGhazals.size > historySizeLimit) {
            allGhazals.filterNot { recentGhazalIds.contains(it.ghazalNumber) }
        } else {
            allGhazals
        }

        val pool = if (available.isNotEmpty()) available else allGhazals
        val selected = pool[Random.nextInt(pool.size)]

        // Record in history queue
        recentGhazalIds.addLast(selected.ghazalNumber)
        if (recentGhazalIds.size > historySizeLimit) {
            recentGhazalIds.removeFirst()
        }

        return selected
    }

    override suspend fun getAllGhazals(): List<HafezPoem> {
        return dataSource.loadGhazalsWithMoshi()
    }

    override fun getGhazalByNumber(number: Int): Flow<HafezPoem?> = flow {
        val all = dataSource.loadGhazalsWithMoshi()
        emit(all.find { it.ghazalNumber == number })
    }
}`
  },
  {
    id: 'viewmodel',
    filename: 'FalViewModel.kt',
    path: 'app/src/main/java/com/hafez/fal/presentation/viewmodel/FalViewModel.kt',
    language: 'kotlin',
    category: 'step2',
    title: '2. ViewModel with Coroutines & StateFlow',
    description: 'MVVM ViewModel managing state transitions, 2.5s book opening delay, bookmarks, and non-repeating logic.',
    code: `package com.hafez.fal.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.hafez.fal.domain.repository.HafezRepository
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class FalViewModel(
    private val repository: HafezRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<FalUiState>(FalUiState.Idle)
    val uiState: StateFlow<FalUiState> = _uiState.asStateFlow()

    // Bookmarked Ghazal IDs stored in memory / local state
    private val _bookmarks = MutableStateFlow<Set<Int>>(emptySet())
    val bookmarks: StateFlow<Set<Int>> = _bookmarks.asStateFlow()

    fun onEvent(event: FalEvent) {
        when (event) {
            is FalEvent.StartNiyat -> {
                _uiState.value = FalUiState.Contemplating
            }
            is FalEvent.OpenBookAndRevealFal -> {
                takeFal()
            }
            is FalEvent.RepeatFal -> {
                takeFal()
            }
            is FalEvent.ToggleBookmark -> {
                toggleCurrentBookmark()
            }
            is FalEvent.ResetToHome -> {
                _uiState.value = FalUiState.Idle
            }
        }
    }

    private fun takeFal() {
        viewModelScope.launch {
            try {
                // 1. Enter mystical Book Opening & Incense smoke state
                _uiState.value = FalUiState.OpeningBook

                // 2. Fetch random poem without consecutive repeat
                val poem = repository.getRandomFal()

                // 3. Smooth dramatic pause for book animation (~2400ms)
                delay(2400)

                // 4. Reveal result
                val isBookmarked = _bookmarks.value.contains(poem.ghazalNumber)
                _uiState.value = FalUiState.Success(
                    poem = poem,
                    isBookmarked = isBookmarked
                )
            } catch (e: Exception) {
                _uiState.value = FalUiState.Error(
                    message = e.localizedMessage ?: "خطا در بارگذاری دیوان حافظ"
                )
            }
        }
    }

    private fun toggleCurrentBookmark() {
        val current = _uiState.value
        if (current is FalUiState.Success) {
            val num = current.poem.ghazalNumber
            val updated = _bookmarks.value.toMutableSet()
            val newStatus = if (updated.contains(num)) {
                updated.remove(num)
                false
            } else {
                updated.add(num)
                true
            }
            _bookmarks.value = updated
            _uiState.value = current.copy(isBookmarked = newStatus)
        }
    }
}`
  },

  // STEP 3: Theme, Color, Typography, RTL
  {
    id: 'theme-color',
    filename: 'Color.kt',
    path: 'app/src/main/java/com/hafez/fal/presentation/theme/Color.kt',
    language: 'kotlin',
    category: 'step3',
    title: '3. Persian Palette (Navy, Turquoise & Royal Gold)',
    description: 'Material 3 Color definitions inspired by Isfahan and Shiraz Tazhib manuscript illumination.',
    code: `package com.hafez.fal.presentation.theme

import androidx.compose.ui.graphics.Color

// Persian Classical Palette
val PersianNavyDark = Color(0xFF080E18)       // Deep Midnight Canvas
val PersianNavy = Color(0xFF0D1B2A)           // Background Surface
val PersianNavySurface = Color(0xFF142436)    // Elevated Card Surface
val PersianNavyBorder = Color(0xFF1F354D)     // Hairline Dividers

// Turquoise (فیروزه‌ای نیشابور)
val PersianTurquoise = Color(0xFF14B8A6)
val PersianTurquoiseLight = Color(0xFF5EEAD4)
val PersianTurquoiseDark = Color(0xFF0F766E)

// Royal Gold (زرین و تذهیب)
val RoyalGold = Color(0xFFD4AF37)
val RoyalGoldLight = Color(0xFFFBF0B9)
val RoyalGoldDark = Color(0xFFAA771C)
val RoyalGoldContainer = Color(0x33D4AF37)

// Text Neutrals
val TextPrimary = Color(0xFFF8FAFC)
val TextSecondary = Color(0xFF94A3B8)
val TextMuted = Color(0xFF64748B)`
  },
  {
    id: 'theme-type',
    filename: 'Type.kt',
    path: 'app/src/main/java/com/hafez/fal/presentation/theme/Type.kt',
    language: 'kotlin',
    category: 'step3',
    title: '3. Persian Typography (Vazirmatn & Naskh)',
    description: 'Jetpack Compose Material 3 Typography configured with Vazirmatn font family for optimal Persian legibility.',
    code: `package com.hafez.fal.presentation.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.hafez.fal.R

// Persian Vazirmatn Font Family (Place .ttf files in res/font/)
val VazirmatnFontFamily = FontFamily(
    Font(R.font.vazirmatn_regular, FontWeight.Normal),
    Font(R.font.vazirmatn_medium, FontWeight.Medium),
    Font(R.font.vazirmatn_bold, FontWeight.Bold)
)

val HafezTypography = Typography(
    displayLarge = TextStyle(
        fontFamily = VazirmatnFontFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 28.sp,
        lineHeight = 40.sp,
        color = RoyalGold
    ),
    headlineMedium = TextStyle(
        fontFamily = VazirmatnFontFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 20.sp,
        lineHeight = 32.sp,
        color = TextPrimary
    ),
    titleLarge = TextStyle(
        fontFamily = VazirmatnFontFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 18.sp,
        lineHeight = 28.sp,
        color = RoyalGoldLight
    ),
    bodyLarge = TextStyle(
        fontFamily = VazirmatnFontFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 30.sp, // Ample line height for Persian poetic couplets
        color = TextPrimary
    ),
    bodyMedium = TextStyle(
        fontFamily = VazirmatnFontFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 24.sp,
        color = TextSecondary
    ),
    labelLarge = TextStyle(
        fontFamily = VazirmatnFontFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 14.sp,
        lineHeight = 20.sp
    )
)`
  },
  {
    id: 'theme-main',
    filename: 'Theme.kt',
    path: 'app/src/main/java/com/hafez/fal/presentation/theme/Theme.kt',
    language: 'kotlin',
    category: 'step3',
    title: '3. Theme Setup & Strict RTL Direction',
    description: 'Theme wrapper enforcing CompositionLocalProvider with LayoutDirection.Rtl and dark Persian aesthetic.',
    code: `package com.hafez.fal.presentation.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection

private val PersianDarkColorScheme = darkColorScheme(
    primary = RoyalGold,
    onPrimary = PersianNavyDark,
    primaryContainer = RoyalGoldContainer,
    onPrimaryContainer = RoyalGoldLight,
    secondary = PersianTurquoise,
    onSecondary = PersianNavyDark,
    background = PersianNavyDark,
    surface = PersianNavy,
    onBackground = TextPrimary,
    onSurface = TextPrimary
)

@Composable
fun HafezTheme(
    content: @Composable () -> Unit
) {
    // Crucial for Persian UI: Enforce Right-to-Left (RTL) Layout Direction globally
    CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
        MaterialTheme(
            colorScheme = PersianDarkColorScheme,
            typography = HafezTypography,
            content = content
        )
    }
}`
  },

  // STEP 4: Compose UI Screens
  {
    id: 'home-screen',
    filename: 'HomeScreen.kt',
    path: 'app/src/main/java/com/hafez/fal/presentation/screens/home/HomeScreen.kt',
    language: 'kotlin',
    category: 'step4',
    title: '4. Home Screen with Persian Tazhib',
    description: 'Elegant landing screen featuring circular gold-embossed button, animated glow, and Divan cover imagery.',
    code: `package com.hafez.fal.presentation.screens.home

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.hafez.fal.presentation.theme.*

@Composable
fun HomeScreen(
    onNavigateToNiyat: () -> Unit,
    modifier: Modifier = Modifier
) {
    // Breathing pulse animation for "نیت و فال" CTA
    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.04f,
        animationSpec = infiniteRepeatable(
            animation = tween(1400, easing = EaseInOutCubic),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scale"
    )

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(PersianNavyDark, PersianNavy, Color(0xFF060B12))
                )
            )
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxSize()
        ) {
            // Header: Bismillah & Persian Title
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.padding(top = 40.dp)
            ) {
                Text(
                    text = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
                    style = MaterialTheme.typography.bodyMedium.copy(
                        color = RoyalGold.copy(alpha = 0.8f),
                        fontSize = 15.sp
                    )
                )
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = "دیوان خواجه حافظ شیرازی",
                    style = MaterialTheme.typography.displayLarge.copy(fontSize = 26.sp),
                    textAlign = TextAlign.Center
                )
                Text(
                    text = "تفأل به لسان‌الغیب و ترجمان‌الاسرار",
                    style = MaterialTheme.typography.bodyMedium.copy(color = TextSecondary),
                    modifier = Modifier.padding(top = 6.dp)
                )
            }

            // Centerpiece: Decorative Divan Book & Medallion
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier.size(220.dp)
            ) {
                // Outer rotating/pulsing gold border ring
                Box(
                    modifier = Modifier
                        .size(200.dp)
                        .clip(CircleShape)
                        .border(
                            width = 2.dp,
                            brush = Brush.sweepGradient(listOf(RoyalGold, PersianTurquoise, RoyalGold)),
                            shape = CircleShape
                        )
                )

                // Main CTA Button
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .size(160.dp)
                        .scale(pulseScale)
                        .clip(CircleShape)
                        .background(
                            Brush.radialGradient(
                                colors = listOf(Color(0xFF1E3A5F), PersianNavy)
                            )
                        )
                        .border(2.dp, RoyalGold, CircleShape)
                        .clickable { onNavigateToNiyat() }
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.AutoAwesome,
                            contentDescription = null,
                            tint = RoyalGold,
                            modifier = Modifier.size(32.dp)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "نیت و فال",
                            style = MaterialTheme.typography.titleLarge.copy(
                                color = RoyalGoldLight,
                                fontWeight = androidx.compose.ui.text.font.FontWeight.Bold
                            )
                        )
                    }
                }
            }

            // Footer Persian Quote
            Card(
                colors = CardDefaults.cardColors(containerColor = PersianNavySurface.copy(alpha = 0.7f)),
                shape = RoundedCornerShape(16.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, PersianNavyBorder),
                modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp)
            ) {
                Text(
                    text = "«بر سر تربت ما چون گذری، همت خواه\\nکه زیارتگه رندان جهان خواهد بود»",
                    style = MaterialTheme.typography.bodySmall.copy(
                        textAlign = TextAlign.Center,
                        color = TextSecondary,
                        lineHeight = 22.sp
                    ),
                    modifier = Modifier.fillMaxWidth().padding(16.dp)
                )
            }
        }
    }
}`
  },
  {
    id: 'result-screen',
    filename: 'ResultScreen.kt',
    path: 'app/src/main/java/com/hafez/fal/presentation/screens/result/ResultScreen.kt',
    language: 'kotlin',
    category: 'step4',
    title: '4. Result Screen (Poem, Tafsir, Share & Repeat)',
    description: 'Complete Result screen with formatted Persian couplets, Tafsir card, Share intent launcher, and Repeat Fal action.',
    code: `package com.hafez.fal.presentation.screens.result

import android.content.Intent
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.hafez.fal.data.model.HafezPoem
import com.hafez.fal.presentation.theme.*

@Composable
fun ResultScreen(
    poem: HafezPoem,
    isBookmarked: Boolean,
    onRepeatClick: () -> Unit,
    onBookmarkToggle: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val couplets = poem.parseCouplets()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(PersianNavyDark)
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Ghazal Title & Number Badge
        Text(
            text = "غزل شماره \${poem.ghazalNumber}",
            style = MaterialTheme.typography.displayLarge.copy(fontSize = 24.sp),
            color = RoyalGold,
            modifier = Modifier.padding(top = 16.dp)
        )
        Text(
            text = "دیوان لسان‌الغیب خواجه حافظ شیرازی",
            style = MaterialTheme.typography.bodySmall.copy(color = TextSecondary),
            modifier = Modifier.padding(top = 4.dp, bottom = 20.dp)
        )

        // Couplets Card (Traditional Framing)
        Card(
            colors = CardDefaults.cardColors(containerColor = PersianNavy),
            shape = RoundedCornerShape(20.dp),
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, RoyalGold.copy(alpha = 0.35f), RoundedCornerShape(20.dp))
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                couplets.forEach { couplet ->
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = couplet.firstMesra,
                            style = MaterialTheme.typography.bodyLarge.copy(
                                fontWeight = FontWeight.Medium,
                                textAlign = TextAlign.Center
                            )
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = couplet.secondMesra,
                            style = MaterialTheme.typography.bodyLarge.copy(
                                fontWeight = FontWeight.Medium,
                                textAlign = TextAlign.Center
                            )
                        )
                        // Persian ornamental separator
                        Text(
                            text = "✦",
                            color = RoyalGold.copy(alpha = 0.4f),
                            fontSize = 10.sp,
                            modifier = Modifier.padding(top = 8.dp)
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Tafsir (تعبیر و تفسیر فال) Section
        Card(
            colors = CardDefaults.cardColors(containerColor = PersianNavySurface),
            shape = RoundedCornerShape(18.dp),
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, PersianTurquoise.copy(alpha = 0.3f), RoundedCornerShape(18.dp))
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(bottom = 12.dp)
                ) {
                    Text(
                        text = "تعبیر و پیام فال",
                        style = MaterialTheme.typography.titleLarge.copy(
                            color = PersianTurquoise,
                            fontWeight = FontWeight.Bold
                        )
                    )
                }
                Text(
                    text = poem.tafsir,
                    style = MaterialTheme.typography.bodyMedium.copy(
                        color = TextPrimary,
                        lineHeight = 26.sp,
                        textAlign = TextAlign.Justify
                    )
                )
            }
        }

        Spacer(modifier = Modifier.height(28.dp))

        // Action Buttons Row: Share, Bookmark, Repeat
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Repeat Fal
            Button(
                onClick = onRepeatClick,
                colors = ButtonDefaults.buttonColors(containerColor = RoyalGold),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.weight(1f).height(50.dp)
            ) {
                Icon(Icons.Default.Refresh, contentDescription = null, tint = PersianNavyDark)
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "فال مجدد",
                    color = PersianNavyDark,
                    fontWeight = FontWeight.Bold
                )
            }

            // Share Fal
            OutlinedButton(
                onClick = {
                    val shareText = "فال حافظ غزل شماره \${poem.ghazalNumber}:\\n\\n\${poem.poem}\\n\\nتعبیر:\\n\${poem.tafsir}"
                    val intent = Intent(Intent.ACTION_SEND).apply {
                        type = "text/plain"
                        putExtra(Intent.EXTRA_TEXT, shareText)
                    }
                    context.startActivity(Intent.createChooser(intent, "اشتراک‌گذاری فال حافظ"))
                },
                shape = RoundedCornerShape(14.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, PersianTurquoise),
                modifier = Modifier.weight(1f).height(50.dp)
            ) {
                Icon(Icons.Default.Share, contentDescription = null, tint = PersianTurquoise)
                Spacer(modifier = Modifier.width(8.dp))
                Text(text = "اشتراک", color = PersianTurquoise)
            }

            // Bookmark Toggle
            IconButton(
                onClick = onBookmarkToggle,
                modifier = Modifier
                    .size(50.dp)
                    .background(PersianNavySurface, RoundedCornerShape(14.dp))
                    .border(1.dp, PersianNavyBorder, RoundedCornerShape(14.dp))
            ) {
                Icon(
                    imageVector = if (isBookmarked) Icons.Default.Bookmark else Icons.Default.BookmarkBorder,
                    contentDescription = "نشان کردن",
                    tint = if (isBookmarked) RoyalGold else TextSecondary
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))
    }
}`
  },

  // STEP 5: Assets and Gradle
  {
    id: 'build-gradle',
    filename: 'build.gradle.kts',
    path: 'app/build.gradle.kts',
    language: 'kotlin',
    category: 'step5',
    title: '5. Gradle Dependencies & Build Setup',
    description: 'app/build.gradle.kts configuration with Jetpack Compose Material 3, Navigation Compose, and Moshi/Gson dependencies.',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp) // Required for Moshi Codegen
}

android {
    namespace = "com.hafez.fal"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.hafez.fal"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    // AndroidX & Lifecycle
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)

    // Jetpack Compose BOM & Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.extended)

    // Navigation Compose
    implementation("androidx.navigation:navigation-compose:2.8.5")

    // Moshi (Preferred for Kotlin)
    implementation("com.squareup.moshi:moshi:1.15.2")
    implementation("com.squareup.moshi:moshi-kotlin:1.15.2")
    ksp("com.squareup.moshi:moshi-kotlin-codegen:1.15.2")

    // Gson (Alternative)
    implementation("com.google.code.gson:gson:2.11.0")

    // Kotlin Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")
}`
  },
  {
    id: 'hafez-json-asset',
    filename: 'hafez.json',
    path: 'app/src/main/assets/hafez.json',
    language: 'json',
    category: 'step5',
    title: '5. Offline Asset (app/src/main/assets/hafez.json)',
    description: 'Place this file in the assets folder of your Android project for 100% offline access.',
    code: `[
  {
    "ghazal_number": 1,
    "poem": "الا یا ایها الساقی ادر کأسا و ناولها\\nکه عشق آسان نمود اول ولی افتاد مشکل‌ها\\n\\nبه بوی نافه‌ای کاخر صبا زان طره بگشاید\\nز تاب جعد مشکینش چه خون افتاد در دل‌ها",
    "tafsir": "ای صاحب فال! راهی که در پیش گرفته‌ای پر از فراز و نشیب و پیچیدگی است. در ابتدا کار برایت ساده و سهل می‌نمود، اما اکنون با چالش‌هایی روبرو شده‌ای. نگران نباش و به خداوند و راهنمایان با تجربه توکل کن. به زودی درهای گشایش و آرامش به رویت باز خواهد شد."
  },
  {
    "ghazal_number": 3,
    "poem": "اگر آن ترک شیرازی به دست آرد دل ما را\\nبه خال هندویش بخشم سمرقند و بخارا را\\n\\nبده ساقی می باقی که در جنت نخواهی یافت\\nکنار آب رکناباد و گلگشت مصلا را",
    "tafsir": "ای صاحب نیت! بخت و اقبال به سوی تو روی آورده است. برای رسیدن به مقصود، سخاوتمندی و گشاده‌دستی پیشه کن. قدر لحظات عمر و شادی‌های اکنون را بدان و بیش از حد نگران آینده مجهول مباش."
  },
  {
    "ghazal_number": 255,
    "poem": "یوسف گمگشته بازآید به کنعان غم مخور\\nکلبه احزان شود روزی گلستان غم مخور\\n\\nای دل غمدیده حالت به شود دل بد مکن\\nوین سر شوریده بازآید به سامان غم مخور",
    "tafsir": "نوید و مژده بسیار بزرگی برای تو در راه است. غم و غصه‌ای که بر قلبت سنگینی می‌کند به زودی زائل خواهد شد. گمشده‌ات باز خواهد گشت و گردش ایام به نفع تو تغییر خواهد کرد. صبر پیشه کن."
  }
]`
  }
];
