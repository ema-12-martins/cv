using UnityEngine;
using FMODUnity;

public class FMODVolumeController : MonoBehaviour
{
    FMOD.Studio.VCA masterVCA;
    FMOD.Studio.VCA musicVCA;
    FMOD.Studio.VCA sfxVCA;

    void Start()
    {
        masterVCA = RuntimeManager.GetVCA("vca:/Master");
        musicVCA = RuntimeManager.GetVCA("vca:/Music");
        sfxVCA = RuntimeManager.GetVCA("vca:/SFX");
    }

    public void SetMasterVolume(float volume)
    {
        masterVCA.setVolume(volume); // Volume: 0.0 to 1.0
    }

    public void SetMusicVolume(float volume)
    {
        musicVCA.setVolume(volume);
    }

    public void SetSFXVolume(float volume)
    {
        sfxVCA.setVolume(volume);
    }

    public void ToggleMasterMute(bool isOn)
    {
        masterVCA.setVolume(isOn ? 0f : 1f);
    }

    public void ToggleMusicMute(bool isOn)
    {
        musicVCA.setVolume(isOn ? 0f : 1f);
    }

    public void ToggleSFXMute(bool isOn)
    {
        sfxVCA.setVolume(isOn ? 0f : 1f);
    }

}
