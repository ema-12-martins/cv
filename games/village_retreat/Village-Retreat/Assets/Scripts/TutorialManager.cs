using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;
using FMODUnity;

public class TutorialManager : MonoBehaviour
{
    public Camera tutorialCam;
    public Camera gameplayCam;
    public GameObject tutorialUI;
    public GameObject gameplayUI;
    public SpeechBalloon player1Balloon;
    public GameObject continuePrompt;
    public Image image1;
    private int step = 0;
    public EventReference musicEvent;
    private FMOD.Studio.EventInstance musicInstance;
    public EventReference speakSound;


    void Start()
    {
        musicInstance = RuntimeManager.CreateInstance(musicEvent);
        musicInstance.set3DAttributes(RuntimeUtils.To3DAttributes(new Vector3(960, 640, -600)));
        musicInstance.setVolume(0.5f);
        musicInstance.start();

        tutorialCam.gameObject.SetActive(true);
        tutorialUI.SetActive(true);
        gameplayCam.gameObject.SetActive(false);
        gameplayUI.SetActive(false);
        continuePrompt.SetActive(false);
        ShowNextStep();
    }

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            ShowNextStep();
        }
    }

    void ShowNextStep()
    {
        player1Balloon.Hide(image1);
        continuePrompt.SetActive(true);
        var instance = RuntimeManager.CreateInstance(speakSound);
        instance.setVolume(0.3f);
        step++;
        switch (step)
        {
            case 1:
                instance.start();
                instance.release();

                player1Balloon.Show("Welcome to the Zen Garden!", image1);
                break;
            case 2:
                instance.start();
                instance.release();
                player1Balloon.Show("Move the pots onto the matching colored targets!", image1);
                break;
            case 3:
                instance.start();
                instance.release();
                player1Balloon.Show("Each pot has a color. Match it with the target!", image1);
                break;
            case 4:
                instance.start();
                instance.release();
                player1Balloon.Show("Light green pots match white targets! Dark green pots match orange targets!", image1);
                break; 
            case 5:
                instance.start();
                instance.release();
                player1Balloon.Show("White pots match green targets and placing both at the same time gives bonus points!", image1);
                break;           
            case 6:
                instance.start();
                instance.release();
                player1Balloon.Show("But be careful... water will destroy your pots!", image1);
                break;
            case 7:
                player1Balloon.Show("Get more points by placing pots quickly and correctly!", image1);
                EndTutorial();
                break;
        }
    }

    public void EndTutorial()
    {
        musicInstance.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
        musicInstance.release();

        tutorialCam.gameObject.SetActive(false);
        tutorialUI.SetActive(false);
        gameplayCam.gameObject.SetActive(true);
        gameplayUI.SetActive(true);

        GameManagerZenGarden.Instance.StartTimer(); 
    }
}
