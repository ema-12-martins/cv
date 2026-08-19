using UnityEngine;
using TMPro;
using UnityEngine.SceneManagement;
using FMODUnity;
using FMOD.Studio;

public class Timer : MonoBehaviour
{
    [SerializeField] TextMeshProUGUI timerText;
    [SerializeField] float remaningTime;
    public bool isRunning = true;
    private bool entered = false;

    public EventInstance instance;

    private string countdown = "event:/Minigames/Electricalconnections/10s_countdown1";

    // Update is called once per frame
    void Update()
    {
        if (!isRunning) return;

        if (remaningTime > 0)
        {
            remaningTime -= Time.deltaTime;
        }
        else if (remaningTime < 0)
        {
            isRunning = false;
            remaningTime = 0;
            timerText.color = new Color(1, 0, 0, 1);
            FindAnyObjectByType<Home>().Invoke("loseScreen", 3);
        }
        if (Mathf.FloorToInt(remaningTime) == 9 && !entered)
        {
            entered = true;
            instance = RuntimeManager.CreateInstance(countdown);
            instance.set3DAttributes(RuntimeUtils.To3DAttributes(transform.position));
            instance.setVolume(0.1f);
            instance.start();
            instance.release();
        }
        int minutes = Mathf.FloorToInt(remaningTime / 60);
        int seconds = Mathf.FloorToInt(remaningTime % 60);
        timerText.text = string.Format("{0:00}:{1:00}", minutes, seconds);
    }
    
    public void StopTimer()
    {
        isRunning = false;
        timerText.color = new Color(0, 1, 0, 1);
    }

    private void changeScene()
    {
        SceneManager.LoadScene("Island", LoadSceneMode.Single);
    }

}
