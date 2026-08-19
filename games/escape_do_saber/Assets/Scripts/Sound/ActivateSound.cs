using UnityEngine;

public class ActivateSound : MonoBehaviour
{
    public AudioSource sound;

    public void PlaySound()
    {
        sound.Play();
    }
}
