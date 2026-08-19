using UnityEngine;
using FMODUnity;

public class MusicInBack : MonoBehaviour
{
    [Header("FMOD Music Settings")]
    [EventRef]
    public string musicEvent = "event:/Music/SceneMusic"; // Escreves isto no Inspector
    public string[] backgroundMusic = { "event:/Music/music 01", "event:/Music/music_animalcrossing1", "event:/Music/music_animalcrossing2", "event:/Music/music_animalcrossing3", "event:/Music/music_animalcrossing4" };
    private int index = 0;

    [Range(0f, 1f)]
    public float volume = 1.0f; // Escreves isto no Inspector também

    private FMOD.Studio.EventInstance musicInstance;
    private FMOD.Studio.EventInstance backgroundInstance;

    void Start()
    {
        // Usa as variáveis escritas no Inspector como "argumentos"
        musicInstance = RuntimeManager.CreateInstance(musicEvent);
        musicInstance.setVolume(volume);
        musicInstance.start();

        backgroundInstance = RuntimeManager.CreateInstance(backgroundMusic[index]);
        backgroundInstance.setVolume(volume / 20);
        backgroundInstance.start();
        backgroundInstance.release();
    }

    void Update()
    {
        FMOD.Studio.PLAYBACK_STATE playbackState;
        musicInstance.getPlaybackState(out playbackState);

        if (playbackState == FMOD.Studio.PLAYBACK_STATE.STOPPED)
        {
            musicInstance.start();
        }

        FMOD.Studio.PLAYBACK_STATE playbackStatebackground;
        backgroundInstance.getPlaybackState(out playbackStatebackground);

        if (playbackStatebackground == FMOD.Studio.PLAYBACK_STATE.STOPPED)
        {
            if (index == 4)
            {
                index = 0;
            }
            else
            {
                index++;
            }
            backgroundInstance = RuntimeManager.CreateInstance(backgroundMusic[index]);
            backgroundInstance.setVolume(volume / 20);
            backgroundInstance.start();
            backgroundInstance.release();
        }
    }

    void OnDestroy()
    {
        musicInstance.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
        musicInstance.release();
        backgroundInstance.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
        backgroundInstance.release();
    }
}
