using UnityEngine;

public abstract class ChallengeBase : MonoBehaviour
{
    [TextArea] public string sentence; // The text to show on the board
    
    // Every challenge must implement this calculation differently
    public abstract bool CheckCompletion();
}