using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using UnityEngine.Rendering.PostProcessing;
using TMPro;
using UnityEngine.SceneManagement;
using UnityEngine.InputSystem;
using Unity.XR.CoreUtils;
using System.Threading.Tasks;

public class XRIntroManager : MonoBehaviour
{
    [Header("UI Panels")]
    public CanvasGroup mainCanvasGroup; 
    public GameObject mainPanel;        
    public GameObject volumePanel;  
    public GameObject conditionPanel;
    public GameObject finalPanel;
    public GameObject pausePanel;

    [Header("UI Sliders")]
    // We need these so we can force them to the right position on start
    public Slider musicSlider;
    public Slider sfxSlider;

    public Slider alturaSlider;

    [Header("Audio Sources")]
    public AudioSource musicSource;
    public AudioSource sfxSource;

    [Header("XR References")]
    public MonoBehaviour moveProvider;

    [Header("Altura")]
    public Transform cameraOffsetTransform;

    public Transform playerTransform;

    [Header("Settings")]
    public float fadeDuration = 1.0f;
    public static float defaultCanvasHeight = 1.25f;
    public static float pauseHeight = 1.25f;

    public int index = 2;

    [Header("Shaders")]
    public GameObject globalVolume;
    public TextMeshProUGUI textoDoBotao;
    private static bool daltonismoAtivo = false;

    private static float savedMusicVolume;
    private static float savedSFXVolume;

    public static int firstMenuAppearing = 0; //0=firstMenu 1=FinalMenu

    public bool isPaused = false;
    public bool isStarted = false;

    private Vector3 initialCanvasPos;

    public InputActionProperty pauseAction;

    public void mudarCor()
    {
        daltonismoAtivo = !daltonismoAtivo;

        if (daltonismoAtivo)
        {
            textoDoBotao.text = "Desligar daltonismo";
            Debug.Log("Modo Daltonismo Ativado.");
        }
        else
        {
            textoDoBotao.text = "Ativar daltonismo";
            Debug.Log("Modo Normal Ativado.");
        }
        
        globalVolume.SetActive(daltonismoAtivo);
    }

    private void Awake()
    {
        
    }

    private void Start()
    {
        // 1. Lock Movement
        if (moveProvider != null) moveProvider.enabled = false;

        // 2. Initialize UI State
        if (firstMenuAppearing == 0)
        {
            mainPanel.SetActive(true);
        }else if (firstMenuAppearing == 1)
        {
            finalPanel.SetActive(true);
        }

        // --- THE FIX IS HERE ---
        // We read the actual volume from the AudioSource and update the slider visually
        if (musicSource != null && musicSlider != null)
        {
            musicSlider.value = musicSource.volume;
        }

        if (sfxSource != null && sfxSlider != null)
        {
            sfxSlider.value = sfxSource.volume;
        }

        initialCanvasPos = mainCanvasGroup.transform.position;
        
        // daltonismo

        if (daltonismoAtivo)
        {
            globalVolume.SetActive(true);
            textoDoBotao.text = "Desligar daltonismo";
        }
        else
        {
            globalVolume.SetActive(false);
            textoDoBotao.text = "Ativar daltonismo";
        }

        SetMusicVolume(savedMusicVolume);
        SetSFXVolume(savedSFXVolume);

    }

    // --- BUTTON FUNCTIONS ---

    public void OnStartClicked()
    {
        StartCoroutine(FadeOutAndStart());
        isStarted = true;
    }

    public void OnCounditionClicked()
    {
        mainPanel.SetActive(false);
        pausePanel.SetActive(false);
        conditionPanel.SetActive(true);

        pauseHeight = mainCanvasGroup.transform.position.y;
    }


    public void OnSoundClicked()
    {
        mainPanel.SetActive(false);
        pausePanel.SetActive(false);
        volumePanel.SetActive(true);
    }

    public void OnBackClicked()
    {
        volumePanel.SetActive(false);

        if (isPaused) pausePanel.SetActive(true);
        else mainPanel.SetActive(true);

        conditionPanel.SetActive(false);
    }

    public void OnExitClicked()
    {
        #if UNITY_EDITOR
            UnityEditor.EditorApplication.isPlaying = false;
        #else
            Application.Quit();
        #endif
    }

    // --- AUDIO LOGIC ---

    public void SetMusicVolume(float sliderValue)
    {
        if (musicSource != null)
        {
            musicSource.volume = sliderValue;
            savedMusicVolume = sliderValue;
        }
    }

    public void SetSFXVolume(float sliderValue)
    {
        if (sfxSource != null)
        {
            sfxSource.volume = sliderValue;
            savedSFXVolume = sliderValue;
        }
    }

    public void SetAltura(float sliderValue)
    {
        if (cameraOffsetTransform != null)
        {
            print("Camera Altura: " + cameraOffsetTransform.localPosition.y);
            Vector3 novaPosicaoLocal = cameraOffsetTransform.localPosition;
            novaPosicaoLocal.y = sliderValue - 1f; 
            cameraOffsetTransform.localPosition = novaPosicaoLocal;
            if (isPaused)
            {
                mainCanvasGroup.transform.position = new Vector3(
                    mainCanvasGroup.transform.position.x,
                    pauseHeight + (sliderValue - 1f),
                    mainCanvasGroup.transform.position.z
                );
            }
            else
                mainCanvasGroup.transform.position = new Vector3(
                    mainCanvasGroup.transform.position.x,
                    defaultCanvasHeight + (sliderValue - 1f),
                    mainCanvasGroup.transform.position.z
                );

        }
    }

    public void grabGraduationHat()
    {
        firstMenuAppearing = 1;
        SceneManager.LoadScene(SceneManager.GetActiveScene().name);
    }

    public void RestartGame()
    {
        firstMenuAppearing = 0;
        SceneManager.LoadScene(SceneManager.GetActiveScene().name); 
    }

    // --- FADE LOGIC ---

    private IEnumerator FadeOutAndStart()
    {
        float startAlpha = mainCanvasGroup.alpha;
        float time = 0;

        while (time < fadeDuration)
        {
            time += Time.deltaTime;
            mainCanvasGroup.alpha = Mathf.Lerp(startAlpha, 0, time / fadeDuration);
            yield return null;
        }

        mainCanvasGroup.alpha = 0;
        mainCanvasGroup.interactable = false;
        mainCanvasGroup.blocksRaycasts = false;
        
        if (moveProvider != null) moveProvider.enabled = true;
        
        mainCanvasGroup.gameObject.SetActive(false);
    }

    public void ResetCanvasPosition()
    {
        mainCanvasGroup.transform.position = initialCanvasPos;
    }

    public void OnPause()
    {
        isPaused = true;

        if (moveProvider != null) moveProvider.enabled = false;

        

        mainCanvasGroup.gameObject.SetActive(true);
        mainCanvasGroup.alpha = 1;
        mainCanvasGroup.interactable = true;
        mainCanvasGroup.blocksRaycasts = true;

        pausePanel.SetActive(true);
        mainPanel.SetActive(false);
        volumePanel.SetActive(false);
        conditionPanel.SetActive(false);
        finalPanel.SetActive(false);

        volumePanel.transform.localEulerAngles = new Vector3(0, 180, 0);
        conditionPanel.transform.localEulerAngles = new Vector3(0, 180, 0);
        moveCanvasInFrontOfPlayer();

        if (moveProvider != null) moveProvider.enabled = false;
    }

    public void OnResume()
    {
        isPaused = false;
        if (moveProvider != null) moveProvider.enabled = true;

        mainCanvasGroup.gameObject.SetActive(false);
        pausePanel.SetActive(false);

        volumePanel.transform.localEulerAngles = new Vector3(0, 0, 0);
        conditionPanel.transform.localEulerAngles = new Vector3(0, 0, 0);

        mainCanvasGroup.transform.position = initialCanvasPos;
    }


    private void moveCanvasInFrontOfPlayer()
    {
        mainCanvasGroup.transform.position = playerTransform.position + playerTransform.forward * 2.0f;
        mainCanvasGroup.transform.LookAt(playerTransform, Vector3.up);
    }

    private void Update()
    {
        if (isStarted)
        {
            if (pauseAction != null && pauseAction.action.WasPerformedThisFrame())
            {
                if (!isPaused)
                {
                    OnPause();
                }else
                {
                    OnResume();
                }
            }
        }
    }
}