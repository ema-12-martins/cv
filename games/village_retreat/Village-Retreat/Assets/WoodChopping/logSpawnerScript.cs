using UnityEngine;
using FMODUnity;

public class LogSpawner : MonoBehaviour
{
    public GameObject logPrefab;
    public Transform spawnPoint;

    public int score = 0;

    public float timeLeft = 60f; // seconds countdown
    private bool start = false;

    public GameObject currentLog;
    public LogController currentLogController => currentLog?.GetComponent<LogController>();

    public WoodUIManager uiManager; // assign this in inspector

    public string musicSound = "event:/Music/minigames/Mini 02";
    private FMOD.Studio.EventInstance MusicInstance;

    void Start()
    {
        SpawnNewLog();
        uiManager.UpdateScore(score);
        uiManager.UpdateTimer(timeLeft);
        MusicInstance = RuntimeManager.CreateInstance(musicSound);
        MusicInstance.setVolume(0.05f);
        MusicInstance.start();
    }

    public void Stop()
    {
        MusicInstance.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
    }

    void Update()
    {
        // Countdown timer
        if (timeLeft > 0 && start)
        {
            timeLeft -= Time.deltaTime;
            if (timeLeft < 0) timeLeft = 0;

            uiManager.UpdateTimer(timeLeft);

            if (timeLeft == 0)
            {
                // Time's up! You can trigger game over here.
                Debug.Log("Time's up!");
                // Optionally disable gameplay or show game over UI.
                uiManager.ShowGameOver();
            }
        }
    }

    public void SpawnNewLog()
    {
        if (currentLog != null)
        {
            Destroy(currentLog);
        }

        Quaternion rotation = Quaternion.Euler(90f, 180f, 0f);
        currentLog = Instantiate(logPrefab, spawnPoint.position, rotation);
        currentLog.GetComponent<LogController>().spawner = this; // Let log notify us when it's done
    }

    public void AddScore(int a)
    {
        score += a;
        if (score < 0) score = 0;

        if (uiManager != null)
        {
            uiManager.UpdateScore(score);
        }
    }

    public void StartTimer()
    {
        start = true;
    }
}
