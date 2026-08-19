using UnityEngine;
using UnityEngine.EventSystems;
using FMODUnity;

public class UIHoverSound : MonoBehaviour, IPointerEnterHandler
{
    public string hoverSoundEvent = "event:/UI/UI_hover";

    public void OnPointerEnter(PointerEventData eventData)
    {
        if (!string.IsNullOrEmpty(hoverSoundEvent))
        {
            RuntimeManager.PlayOneShot(hoverSoundEvent);
        }
    }
}
