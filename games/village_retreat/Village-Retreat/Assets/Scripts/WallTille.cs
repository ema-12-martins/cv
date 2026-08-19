using UnityEngine;
using FMODUnity;

public class WallTile : MonoBehaviour
{
    public Color targetColor;
    public Color currentColor;
    private Renderer rend;
    public EventReference paintSound;
    public int currentColorIndex = -1;
    public int targetColorIndex = -1;



    void Start()
    {
        rend = GetComponent<Renderer>();
        UpdateVisual();
    }

    public void Paint(Color color, int colorIndex)
    {
        currentColor = color;
        currentColorIndex = colorIndex;
        UpdateVisual();

        var instance = RuntimeManager.CreateInstance(paintSound);
        instance.set3DAttributes(RuntimeUtils.To3DAttributes(transform.position));
        instance.setVolume(0.3f);
        instance.start();
        instance.release();
    }

    public void Clean()
    {
        currentColor = Color.white;
        UpdateVisual();
    }

    void UpdateVisual()
    {
        if (rend != null)
            rend.material.color = currentColor;
    }

    public bool IsCorrect()
    {
        return AreColorsSimilar(currentColor, targetColor, 0.05f);
    }

    private bool AreColorsSimilar(Color a, Color b, float tolerance)
    {
        return Mathf.Abs(a.r - b.r) < tolerance &&
            Mathf.Abs(a.g - b.g) < tolerance &&
            Mathf.Abs(a.b - b.b) < tolerance;
    }

}
