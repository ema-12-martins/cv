using UnityEngine;
using UnityEngine.UI;
using FMODUnity;
using FMOD.Studio;

public class TutorialManagerElectrical : MonoBehaviour
{
    public Camera tutorialCam;
    public Camera gameplayCam;
    public GameObject tutorialUI;
    public GameObject gameplayUI;
    public SpeechBalloon player1Balloon;
    public GameObject continuePrompt;

    public Image image1;

    private int step = 0;

    public EventInstance instance;
    private EventInstance instance2;

    private string minigameMusic1 = "event:/Music/minigames/Mini 01";
    private string minigameMusic2 = "event:/Music/minigames/Mini 02";
    private string dialoge = "event:/Character/Dialogue";

    void Start()
    {
        instance = RuntimeManager.CreateInstance(minigameMusic2);
        instance.set3DAttributes(RuntimeUtils.To3DAttributes(new Vector3(0, 0, 10)));
        instance.setVolume(0.05f);
        instance.start();
        tutorialCam.gameObject.SetActive(true);
        tutorialUI.SetActive(true);
        gameplayCam.gameObject.SetActive(false);
        gameplayUI.SetActive(false);
        continuePrompt.SetActive(false);
        player1Balloon.Hide(image1);
        instance.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
        ShowNextStep();
    }

    void Update()
    {
        FMOD.Studio.PLAYBACK_STATE playbackState;
        instance.getPlaybackState(out playbackState);

        if (playbackState == FMOD.Studio.PLAYBACK_STATE.STOPPED)
        {
            instance.start();
        }

        if (Input.GetKeyDown(KeyCode.Space))
        {
            ShowNextStep();
        }
    }

    void ShowNextStep()
    {
        step++;
        player1Balloon.Hide(image1);
        continuePrompt.SetActive(true);


        switch (step)
        {
            case 1:
                player1Balloon.Show("Welcome to the Eletrical!", image1);
                instance2 = RuntimeManager.CreateInstance(dialoge);
                instance2.set3DAttributes(RuntimeUtils.To3DAttributes(new Vector3(0, 0, 10)));
                instance2.setVolume(0.2f);
                instance2.start();
                break;
            case 2:
                player1Balloon.Show("Rotate the cables with Enter and E to guide the power to the house!", image1);
                instance2.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
                instance2.start();
                break;
            case 3:
                player1Balloon.Show("If the cable is yellow, it has power!", image1);
                instance2.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
                instance2.start();
                break;
            case 4:
                player1Balloon.Show("You must connect all cables to either another cable, a generator or the house!", image1);
                instance2.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
                instance2.start();
                break; 
            case 5:
                player1Balloon.Show("All cables must be powered to win the game!", image1);
                instance2.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
                instance2.start();
                break;           
            case 6:
                player1Balloon.Show("But you will have to work together!", image1);
                instance2.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
                instance2.start();
                break;
            case 7:
                player1Balloon.Show("Each player only controls half of the wall!", image1);
                instance2.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
                instance2.start();
                break;
            case 8:
                player1Balloon.Show("Work together and beat the timer to get electricity to your new house!", image1);
                instance2.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
                instance2.start();
                break;
            case 9:
                player1Balloon.Show("Good luck!", image1);
                instance2.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
                instance2.start();
                break;
            case 10:
                EndTutorial();
                break;
        }
    }

    public void EndTutorial()
    {
        instance.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
        instance.release();
        instance2.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
        instance2.release();
        instance = RuntimeManager.CreateInstance(minigameMusic1);
        instance.set3DAttributes(RuntimeUtils.To3DAttributes(new Vector3(-0.5f, 4.5f, 6)));
        instance.setVolume(0.05f);
        instance.start();
        instance.release();
        tutorialCam.gameObject.SetActive(false);
        tutorialUI.SetActive(false);
        gameplayCam.gameObject.SetActive(true);
        gameplayUI.SetActive(true);
    }
}
