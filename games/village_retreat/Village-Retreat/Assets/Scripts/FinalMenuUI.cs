using UnityEngine;
using UnityEngine.SceneManagement;
using FMODUnity;
using FMOD.Studio;

public class FinalMenuUI : MonoBehaviour
{
    public GameObject optionsPanel;
    public GameObject mainMenuPanel; 
    public string skipSound = "event:/UI/Skip";
    public string contSound = "event:/UI/UI_click_menu_hover";
    public string background = "event:/Ambience/ambience_wind_birds_leaves";
    private bool start = true;

    private EventInstance instance;

    public void StartGame()
    {
        RuntimeManager.PlayOneShot(skipSound, transform.position);
        GlobalVariables.Instance.bush = 0;
        GlobalVariables.Instance.wood = 0;
        GlobalVariables.Instance.ink = 0;
        GlobalVariables.Instance.light = 0;
        SceneManager.LoadScene("Island");
    }

    public void OpenOptions()
    {
        RuntimeManager.PlayOneShot(contSound, transform.position);
        optionsPanel.SetActive(true);
        if (mainMenuPanel != null)
            mainMenuPanel.SetActive(false); 
    }

    public void CloseOptions()
    {
        RuntimeManager.PlayOneShot(contSound, transform.position);
        optionsPanel.SetActive(false);
        if (mainMenuPanel != null)
            mainMenuPanel.SetActive(true);
    }

    public void QuitGame()
    {
        RuntimeManager.PlayOneShot(skipSound, transform.position);
        Application.Quit();

        #if UNITY_EDITOR
        UnityEditor.EditorApplication.isPlaying = false;
        #endif
    }

    void Update()
    {
        if (start)
        {
            instance = RuntimeManager.CreateInstance(background);
            instance.set3DAttributes(RuntimeUtils.To3DAttributes(transform.position));
            instance.setVolume(0.5f);
            instance.start();
            instance.release();
            start = false;
        }
        FMOD.Studio.PLAYBACK_STATE playbackState;
        instance.getPlaybackState(out playbackState);

        if (playbackState == FMOD.Studio.PLAYBACK_STATE.STOPPED)
        {
            instance.start();
        }
    }
}
