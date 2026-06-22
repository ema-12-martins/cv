using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem.XR;

public class SkeletonThings : MonoBehaviour


{
    public Dictionary<string, bool> bones = new Dictionary<string, bool>()
    {
        {"Cranio", false},
        {"Mandibula", false},
        {"Coluna", false},
        {"Mão Esquerda", false},
        {"Mão Direita", false},
        {"Femur Esquerdo", false}
    };

    [Header("Sounds")]
    public ActivateSound finishGameSounds;

    [Header("Finish Game")]
    public GamesManager gamesManager;
    public GameObject OutlineObject;

    void Start()
    {
        StartGame();   
    }

    private void printGameState()
    {
        Debug.Log("Current Skeleton Game State:");
        foreach (var bone in bones)
        {
            Debug.Log(bone.Key + ": " + (bone.Value ? "Collected" : "Not Collected") + ";");
        }
    }
    void CompleteSkeletonGame()
    {
        foreach (var bone in bones)
        {
            if (!bone.Value)
            {
                printGameState();
                return; // If any bone is not collected, exit the method
            }
        }
        Debug.Log("Skeleton completed!");
        OutlineObject.SetActive(false);
        finishGameSounds.PlaySound();

        gamesManager.scienceGame = 1;
        gamesManager.changeCanvas(3);
        gamesManager.completeAllGames();
    }

    public void CollectBone(string boneName)
    {
        bones[boneName] = true;
        CompleteSkeletonGame();
    }

    public bool IsBoneCollected(string boneName)
    {
        return bones.ContainsKey(boneName) && bones[boneName];
    }

    private void StartGame()
    {
        // Check for available bones
        BoneScript[] availableBones = FindObjectsByType<BoneScript>(FindObjectsSortMode.None);
        Debug.Log("Number of available bones in the scene: " + availableBones.Length);
        Debug.Log("Expected number of bones: " + bones.Count);
        if (availableBones.Length == bones.Count)
        {
            foreach (var bone in availableBones)
            {
                bool ok = false;
                Debug.Log("Available bone: " + bone.boneName);
                foreach (var key in bones.Keys)
                {
                    if (bone.boneName == key)
                    {
                        ok = true;
                        break;
                    }
                }
                if (!ok)
                {
                    Debug.LogWarning("Bone not recognized: " + bone.boneName);
                }
            }
            
        }else
        
        {
            Debug.LogError("Mismatch in available bones and expected bones. Available: " + availableBones.Length + ", Expected: " + bones.Count);
        }

    } 
}
