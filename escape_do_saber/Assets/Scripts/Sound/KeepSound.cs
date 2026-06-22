using UnityEngine;
public class KeepSound : MonoBehaviour
{
    private static KeepSound instance;

    void Awake()
    {
        // Check if an instance already exists
        if (instance == null)
        {
            instance = this;
            // This prevents the object from being deleted when loading a new scene
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            // If another instance exists, destroy this one to avoid duplicate music
            Destroy(gameObject);
        }
    }
}
