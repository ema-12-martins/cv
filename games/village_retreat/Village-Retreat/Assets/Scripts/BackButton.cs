using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.EventSystems;
using FMODUnity;

public class BackButton : MonoBehaviour, IPointerEnterHandler
{
    public string sceneName;
    public string hoverSoundEvent = "event:/UI/UI_hover";
    public string clickSound = "event:/UI/UI_click_menu_hover";

    public void ChangeScene()
    {
        RuntimeManager.PlayOneShot(clickSound);
        SceneManager.LoadScene(sceneName);
    }

    public void OnPointerEnter(PointerEventData eventData)
    {
        if (!string.IsNullOrEmpty(hoverSoundEvent))
        {
            RuntimeManager.PlayOneShot(hoverSoundEvent);
        }
    }
}
