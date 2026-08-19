using TMPro;
using UnityEngine;

public class Tooltip : MonoBehaviour
{
    public Transform target;
    public TextMeshPro textMeshPro;

    private void Start()
    {
        textMeshPro = GetComponent<TextMeshPro>();
    }

    public void SetText(string text)
    {
        textMeshPro.text = text;
    }

    public void ResizeCanvas(float width, float height)
    {
        RectTransform rectTransform = GetComponent<RectTransform>();
        rectTransform.sizeDelta = new Vector2(width, height);
        textMeshPro.fontSize = Mathf.Min(width, height) * 0.8f; // Example scaling
    }

    private void Update()
    {
        if (target != null)
        {
            transform.LookAt(target, Vector3.up);
        }
    }
}
