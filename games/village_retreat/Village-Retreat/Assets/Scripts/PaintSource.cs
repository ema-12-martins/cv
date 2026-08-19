using UnityEngine;

public enum PlayerOwner { Player1, Player2 }

public class PaintSource : MonoBehaviour
{
    public Color paintColor;
    public PlayerOwner owner;
    public int colorIndex;

    void Start()
    {
        Color[] paletteColors = FindFirstObjectByType<PatternManager>().palette.colors;
        for (int i = 0; i < paletteColors.Length; i++)
        {
            if (AreColorsClose(paletteColors[i], paintColor, 0.01f))
            {
                colorIndex = i;
                break;
            }
        }

        GetComponent<Renderer>().material.color = paintColor;
    }

    bool AreColorsClose(Color a, Color b, float tolerance)
    {
        return Mathf.Abs(a.r - b.r) < tolerance &&
            Mathf.Abs(a.g - b.g) < tolerance &&
            Mathf.Abs(a.b - b.b) < tolerance;
    }

}
