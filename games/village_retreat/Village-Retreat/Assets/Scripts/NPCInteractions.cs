using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using TMPro;

public class NPCInteraction : MonoBehaviour
{
    public TextMeshProUGUI player1PromptText;
    public TextMeshProUGUI player2PromptText;

    private bool player1Nearby = false;
    private bool player2Nearby = false;

    private bool player1Ready = false;
    private bool player2Ready = false;

    private GameObject player1InteractingWith = null;
    private GameObject player2InteractingWith = null;

    public Animator player1Animator;
    public Animator player2Animator;
    public Animator NPCAnimator;


    void Start()
    {
        player1PromptText.gameObject.SetActive(false);
        player2PromptText.gameObject.SetActive(false);
    }

    void Update()
    {
        // PLAYER 1 INTERAÇÃO
        if (player1Nearby)
        {
            if (!player1Ready)
            {
                if (player1InteractingWith != null && player1InteractingWith.name == "WoodWorker")
                {
                    player1PromptText.text = "Press ALT to play WoodWorker";
                }else if (player1InteractingWith != null && player1InteractingWith.name == "Bricklayer")
                {
                    player1PromptText.text = "Press ALT to play Bricklayer";
                }else if (player1InteractingWith != null && player1InteractingWith.name == "Painter")
                {
                    player1PromptText.text = "Press ALT to play Painter";
                }else if (player1InteractingWith != null && player1InteractingWith.name == "Gardener")
                {
                    player1PromptText.text = "Press ALT to play Gardener";
                }
                else if (player1InteractingWith != null && player1InteractingWith.name == "Electrician")
                {
                    player1PromptText.text = "Press ALT to play Electrician";
                }

                    if (Input.GetKeyDown(KeyCode.LeftAlt) || Input.GetKeyDown(KeyCode.RightAlt))
                {
                    player1Ready = true;
                    player1PromptText.text = "Waiting for the second player...\n(Press ESC to exit)";
                    NPCAnimator.SetBool("isTalking", true);
                    player1Animator.SetBool("isTalking", true);
                    player1Animator.SetTrigger("triggerTalk");

                }
            }
            else
            {
                if (Input.GetKeyDown(KeyCode.Escape))
                {
                    player1Ready = false;
                    NPCAnimator.SetBool("isTalking", false);
                    player1Animator.SetBool("isTalking", false);
                    if (player1InteractingWith != null && player1InteractingWith.name == "WoodWorker")
                    {
                        player1PromptText.text = "Press ALT to play WoodWorker";
                    }
                    else if (player1InteractingWith != null && player1InteractingWith.name == "Bricklayer")
                    {
                        player1PromptText.text = "Press ALT to play Bricklayer";
                    }
                    else if (player1InteractingWith != null && player1InteractingWith.name == "Painter")
                    {
                        player1PromptText.text = "Press ALT to play Painter";
                    }
                    else if (player1InteractingWith != null && player1InteractingWith.name == "Gardener")
                    {
                        player1PromptText.text = "Press ALT to play Gardener";
                    }
                    else if (player1InteractingWith != null && player1InteractingWith.name == "Electrician")
                    {
                        player1PromptText.text = "Press ALT to play Electrician";
                    }
                }
            }
        }

        // PLAYER 2 INTERAÇÃO
        if (player2Nearby)
        {
            if (!player2Ready)
            {
                if (player2InteractingWith != null && player2InteractingWith.name == "WoodWorker")
                {
                    player2PromptText.text = "Press Enter to play WoodWorker";
                }
                else if (player2InteractingWith != null && player2InteractingWith.name == "Bricklayer")
                {
                    player2PromptText.text = "Press Enter to play Bricklayer";
                }
                else if (player2InteractingWith != null && player2InteractingWith.name == "Painter")
                {
                    player2PromptText.text = "Press Enter to play Painter";
                }
                else if (player2InteractingWith != null && player2InteractingWith.name == "Gardener")
                {
                    player2PromptText.text = "Press Enter to play Gardener";
                }
                else if (player2InteractingWith != null && player2InteractingWith.name == "Electrician")
                {
                    player2PromptText.text = "Press Enter to play Electrician";
                }

                if (Input.GetKeyDown(KeyCode.Return))
                {
                    player2Ready = true;
                    player2PromptText.text = "Waiting for the second player...\n(Press Backspace to exit)";
                    NPCAnimator.SetBool("isTalking", true);
                    player2Animator.SetBool("isTalking", true);
                    player2Animator.SetTrigger("triggerTalk");
                }
            }
            else
            {
                if (Input.GetKeyDown(KeyCode.Backspace))
                {
                    player2Ready = false;
                    NPCAnimator.SetBool("isTalking", false);
                    player2Animator.SetBool("isTalking", false);
                    if (player2InteractingWith != null && player2InteractingWith.name == "WoodWorker")
                    {
                        player2PromptText.text = "Press Enter to play WoodWorker";
                    }
                    else if (player2InteractingWith != null && player2InteractingWith.name == "Bricklayer")
                    {
                        player2PromptText.text = "Press Enter to play Bricklayer";
                    }
                    else if (player2InteractingWith != null && player2InteractingWith.name == "Painter")
                    {
                        player2PromptText.text = "Press Enter to play Painter";
                    }
                    else if (player2InteractingWith != null && player2InteractingWith.name == "Gardener")
                    {
                        player2PromptText.text = "Press Enter to play Gardener";
                    }
                    else if (player2InteractingWith != null && player2InteractingWith.name == "Electrician")
                    {
                        player2PromptText.text = "Press Enter to play Electrician";
                    }
                }
            }
        }

        // INICIAR JOGO SE OS DOIS ESTÃO PRONTOS
        if (player1Ready && player2Ready && (player1InteractingWith == player2InteractingWith))
        {
            player1PromptText.text = "Loading minigame...";
            player2PromptText.text = "Loading minigame...";
            Invoke("StartMiniGame", 1.5f);
        }
    }

    void StartMiniGame()
    {
        player1Ready = false;
        player2Ready = false;
        switch (player2InteractingWith.name) {
            case "WoodWorker":
                SceneManager.LoadScene("MiniGameScene_WoodChopping");
                break;
            case "Bricklayer":
                SceneManager.LoadScene("MiniGameScene_MixingMortar");
                break;
            case "Painter":
                SceneManager.LoadScene("MiniGameScene_PaintingWalls");
                break;
            case "Gardener":
                SceneManager.LoadScene("MiniGameScene_ZenGarden");
                break;
            case "Electrician":
                SceneManager.LoadScene("MiniGameScene_ElectricalConnections");
                break;
            default:
                player1PromptText.text = "Minigame non existant";
                player2PromptText.text = "Minigame non existant";
                Invoke("Update", 1.5f);
                break;
        }

    }

    void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Player1"))
        {
            player1Nearby = true;
            player1PromptText.gameObject.SetActive(true);
            player1InteractingWith = gameObject;

        }

        if (other.CompareTag("Player2"))
        {
            player2Nearby = true;
            player2PromptText.gameObject.SetActive(true);
            player2InteractingWith = gameObject;
        }
    }

    void OnTriggerExit(Collider other)
    {
        if (other.CompareTag("Player1"))
        {
            player1Nearby = false;
            player1PromptText.gameObject.SetActive(false);
            player1Ready = false;
            player1InteractingWith = null;
        }

        if (other.CompareTag("Player2"))
        {
            player2Nearby = false;
            player2PromptText.gameObject.SetActive(false);
            player2Ready = false;
            player2InteractingWith = null;
        }
    }
}
