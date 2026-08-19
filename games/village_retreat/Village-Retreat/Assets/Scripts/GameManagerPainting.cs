using System;
using TMPro;
using UnityEngine;
using UnityEngine.SceneManagement;
using FMODUnity;


public class GameManagerPainting : MonoBehaviour
{
     public TextMeshProUGUI timerText;
     public TextMeshProUGUI scoreText;
     public float maxTime = 180f;
     private float timeRemaining;
     private bool isRunning = false;
     private int score = 0;
     public GameObject endScreen;
     public GameObject gameScreen;
     public TextMeshProUGUI endMessage;
     public float returnDelay = 30f;
     private float returnTimer;
     public TextMeshProUGUI returnCountdownText;
     public EventReference endScreenMusicEvent;
     private FMOD.Studio.EventInstance endScreenMusicInstance;
     public EventReference gameplayMusicEvent;
     private FMOD.Studio.EventInstance gameplayMusicInstance;

     void Start()
     {
          timeRemaining = maxTime;
          isRunning = false;
     }

     void Update()
     {
          if (!isRunning) return;

          timeRemaining -= Time.deltaTime;
          timeRemaining = Mathf.Max(0, timeRemaining);

          UpdateTimerUI();

          if (timeRemaining <= 0)
          {
               EndGame();
          }
     }

     void UpdateTimerUI()
     {
          int minutes = Mathf.FloorToInt(timeRemaining / 60f);
          int seconds = Mathf.FloorToInt(timeRemaining % 60f);
          timerText.text = $"< TIME > \n {minutes:00}:{seconds:00}";
     }

     public void EndGame(string message = "Time's up!")
     {
          if (gameplayMusicInstance.isValid())
          {
               gameplayMusicInstance.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
               gameplayMusicInstance.release();
          }

          isRunning = false;
          Debug.Log("Game Over: " + message);

          if (endScreen != null)
          {
               endScreenMusicInstance = RuntimeManager.CreateInstance(endScreenMusicEvent);
               endScreenMusicInstance.set3DAttributes(RuntimeUtils.To3DAttributes(transform.position));
               endScreenMusicInstance.setVolume(0.01f);
               endScreenMusicInstance.start();

               gameScreen.SetActive(false);
               endScreen.SetActive(true);

               if (endMessage != null)
               {
                    endMessage.text = message;

                    if (message != "Time's up!")
                         GlobalVariables.Instance.ink = 1;
               }

               returnTimer = returnDelay;
               InvokeRepeating(nameof(UpdateReturnCountdown), 0f, 1f);
          }
     }

     void UpdateReturnCountdown()
     {
          returnTimer -= 1f;
          if (returnCountdownText != null)
               returnCountdownText.text = $"Returning to island in {Mathf.CeilToInt(returnTimer)}s!";

          if (returnTimer <= 0)
          {
               CancelInvoke(nameof(UpdateReturnCountdown));
               LoadMainMenu();
          }
     }

     public void OnBackButtonPressed()
     {
          CancelInvoke(nameof(UpdateReturnCountdown));
          LoadMainMenu();
     }

    void LoadMainMenu()
    {
          if (endScreenMusicInstance.isValid())
          {
               endScreenMusicInstance.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
               endScreenMusicInstance.release();
          }

          if (GlobalVariables.Instance.bush == 1 && GlobalVariables.Instance.wood == 1 && GlobalVariables.Instance.ink == 1 && GlobalVariables.Instance.light == 1)
          {
               SceneManager.LoadScene("CutScene");
          }

          else
          {
               SceneManager.LoadScene("Island");
          }

    }

     public void AddScore(int value)
     {
          score += value;
          UpdateScoreUI();
     }

     void UpdateScoreUI()
     {
          if (scoreText != null)
               scoreText.text = $"< SCORE > \n {score}";
     }

     public void StartTimer()
     {
          isRunning = true;
          
          gameplayMusicInstance = RuntimeManager.CreateInstance(gameplayMusicEvent);
          gameplayMusicInstance.set3DAttributes(RuntimeUtils.To3DAttributes(transform.position));
          gameplayMusicInstance.setVolume(0.05f);
          gameplayMusicInstance.start();
     }

    public void Surrender()
    {
        EndGame("Surrender!");
    }
}
