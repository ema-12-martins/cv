using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public enum UIState
{
    MainMenu,
    CharacterSelect, // Se for o caso
    InGame,
    Pause,
    Dialogue,
    Minigame
}

public class UIManager : MonoBehaviour
{
    public static UIManager Instance;

    public GameObject mainMenuUI;
    public GameObject inGameUI;
    public GameObject pauseMenuUI;
    public GameObject dialogueUI;

    private void Awake()
    {
        if (Instance == null) Instance = this;
        else Destroy(gameObject);
    }

    public void SetUIState(UIState state)
    {
        mainMenuUI.SetActive(state == UIState.MainMenu);
        inGameUI.SetActive(state == UIState.InGame);
        pauseMenuUI.SetActive(state == UIState.Pause);
        dialogueUI.SetActive(state == UIState.Dialogue);
        // pudemos tirar ou adicionar depois
        // faltam os minigames aqui
    }
}
