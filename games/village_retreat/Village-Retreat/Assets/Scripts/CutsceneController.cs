using UnityEngine;
using UnityEngine.SceneManagement;

public class CutsceneController : MonoBehaviour
{
    public void LoadNextScene()
    {
        SceneManager.LoadScene("FinalMenuUI");
    }
}
