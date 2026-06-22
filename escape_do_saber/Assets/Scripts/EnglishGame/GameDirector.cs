using UnityEngine;
using System.Collections.Generic;
using TMPro;

public class GameDirector : MonoBehaviour
{
    [Header("The Challenges (Drag Logic Scripts Here)")]
    public List<ChallengeBase> challenges; 

    [Header("Feedback")]
    public TextMeshPro chalkboardText;
    public DrawerLock drawerLockScript; 
    public float requiredTime = 1.0f; // Global stability timer

    private int currentIndex = 0;
    private float currentTimer = 0f;
    private bool allComplete = false;

    [Header("Sounds")]
    public ActivateSound finishGameSounds;

    [Header("Finish Game")]
    public GamesManager gamesManager;

    void Start()
    {
        UpdateChalkboard();
    }

    void Update()
    {
        if (allComplete) return;

        // Get the current active challenge script
        ChallengeBase currentLogic = challenges[currentIndex];

        // Ask the specific script if its conditions are met
        if (currentLogic.CheckCompletion())
        {
            // If met, start the timer
            currentTimer += Time.deltaTime;
            
            // Optional: Feedback color
            chalkboardText.color = Color.yellow; 

            if (currentTimer >= requiredTime)
            {
                AdvanceLevel();
            }
        }
        else
        {
            currentTimer = 0f;
            chalkboardText.color = Color.black;
        }
    }

    void AdvanceLevel()
    {
        currentTimer = 0f;
        currentIndex++;

        if (currentIndex >= challenges.Count)
        {
            Victory();
        }
        else
        {
            UpdateChalkboard();
            // Play success sound
        }
    }

    void Victory()
    {
        allComplete = true;
        chalkboardText.text = "Muito bem! És um mestre do Inglês :)";
        chalkboardText.color = Color.green;
        if(drawerLockScript != null) drawerLockScript.Unlock();

        finishGameSounds.PlaySound();

        gamesManager.englishGame = 1;
        gamesManager.changeCanvas(2);
        gamesManager.completeAllGames();
    }

    void UpdateChalkboard()
    {
        if (currentIndex < challenges.Count)
        {
            chalkboardText.text = challenges[currentIndex].sentence;
        }
    }
}