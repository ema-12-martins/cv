using UnityEngine;
using UnityEngine.UI;
using FMODUnity;

public class PaintingTutorialManager : MonoBehaviour
{
     public Camera tutorialCam;
     public Camera gameplayCam;
     public GameObject tutorialUI;
     public GameObject gameplayUI;
     public GameObject gameplayUI2;
     public SpeechBalloon player1Balloon;
     public GameObject continuePrompt;
     public Image image1;
     private int step = 0;
     public EventReference speakSound;
     public EventReference tutorialMusicEvent;
     private FMOD.Studio.EventInstance tutorialMusicInstance;


    void Start()
    {
          tutorialMusicInstance = RuntimeManager.CreateInstance(tutorialMusicEvent);
          tutorialMusicInstance.set3DAttributes(RuntimeUtils.To3DAttributes(transform.position));
          tutorialMusicInstance.setVolume(0.08f);
          tutorialMusicInstance.start();

          tutorialCam.gameObject.SetActive(true);
          tutorialUI.SetActive(true);
          gameplayCam.gameObject.SetActive(false);
          gameplayUI.SetActive(false);
          gameplayUI2.SetActive(false);
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
                    player1Balloon.Show("Welcome to the Painting Room!", image1);
                    break;
               case 2:
                    instance.start();
                    instance.release();
                player1Balloon.Show("Your goal is to match the wall with the pattern on the right!", image1);
                    break;
               case 3:
                    instance.start();
                    instance.release();
                    player1Balloon.Show("Move around using WASD or Arrows.", image1);
                    break;
               case 4:
                    instance.start();
                    instance.release();
                player1Balloon.Show("Press F or ENTER to pick colors from buckets.", image1);
                    break;
               case 5:
                    instance.start();
                    instance.release();
                    player1Balloon.Show("Then go to the wall and press your key again to paint!", image1);
                    break;
               case 6:
                    instance.start();
                    instance.release();
                player1Balloon.Show("Work together to complete the pattern before time runs out!", image1);
                    break;
               case 7:
                    EndTutorial();
                    break;
          }
    }

    public void EndTutorial()
    {
          if (tutorialMusicInstance.isValid())
          {
               tutorialMusicInstance.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
               tutorialMusicInstance.release();
          }

          tutorialCam.gameObject.SetActive(false);
          tutorialUI.SetActive(false);
          gameplayCam.gameObject.SetActive(true);
          gameplayUI.SetActive(true);
          gameplayUI2.SetActive(true);

          GameManagerPainting gm = FindFirstObjectByType<GameManagerPainting>();
          if (gm != null)
          {
               gm.enabled = true;           
               gm.StartTimer();            
          }
    }
}
