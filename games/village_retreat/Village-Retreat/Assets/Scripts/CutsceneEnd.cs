using UnityEngine;
using UnityEngine.SceneManagement;

public class CutsceneEnd : MonoBehaviour
{
    public string sceneName;

    public void ChangeScene()
    {
        Debug.Log("Sinal recebido. Mudando de cena para: " + sceneName);
        SceneManager.LoadScene(sceneName);
    }
}
