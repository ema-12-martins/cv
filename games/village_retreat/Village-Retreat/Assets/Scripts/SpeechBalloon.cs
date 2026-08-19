using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System.Collections;

public class SpeechBalloon : MonoBehaviour
{
    public CanvasGroup canvasGroup;
    public TextMeshProUGUI speechText;
    private Coroutine typingCoroutine;
    private Coroutine fadeCoroutine;

    public void Show(string message, Image optionalImage = null)
    {
        if (optionalImage != null)
            optionalImage.gameObject.SetActive(true);

        gameObject.SetActive(true);

        if (fadeCoroutine != null)
            StopCoroutine(fadeCoroutine);
        fadeCoroutine = StartCoroutine(ShowSequence(message));
    }

    public void Hide(Image optionalImage = null)
    {
        if (optionalImage != null)
            optionalImage.gameObject.SetActive(false);

        if (fadeCoroutine != null)
            StopCoroutine(fadeCoroutine);
        fadeCoroutine = StartCoroutine(FadeCanvasGroup(1, 0, 0.2f));
    }

    private IEnumerator ShowSequence(string message)
    {
        canvasGroup.alpha = 0;
        yield return FadeCanvasGroup(0, 1, 0.5f);

        if (typingCoroutine != null)
            StopCoroutine(typingCoroutine);
        typingCoroutine = StartCoroutine(TypeText(message));
    }

    private IEnumerator TypeText(string message)
    {
        speechText.text = "";
        foreach (char c in message)
        {
            speechText.text += c;
            yield return new WaitForSeconds(0.03f);
        }
    }

    private IEnumerator FadeCanvasGroup(float from, float to, float duration)
    {
        float elapsed = 0f;
        canvasGroup.alpha = from;
        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            canvasGroup.alpha = Mathf.Lerp(from, to, elapsed / duration);
            yield return null;
        }
        canvasGroup.alpha = to;

        if (to == 0)
            gameObject.SetActive(false);
    }
}
