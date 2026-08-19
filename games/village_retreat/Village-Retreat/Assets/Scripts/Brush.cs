using UnityEngine;

public class Brush : MonoBehaviour
{
    public Color currentColor = Color.clear;
    private WallTile overlappingTile;
    private PaintSource overlappingSource;
    public UnityEngine.UI.Image brushColorUI;
    private Renderer rend;
    public KeyCode paintKey = KeyCode.Space;
    public PlayerOwner playerOwner;
    public int currentColorIndex = -1;

    void Start()
    {
        rend = GetComponent<Renderer>();

        Color[] palette = FindFirstObjectByType<PatternManager>().palette.colors;

        if (playerOwner == PlayerOwner.Player1 && palette.Length > 0)
        {
            currentColorIndex = 0;
            currentColor = palette[currentColorIndex];
        }
        else if (playerOwner == PlayerOwner.Player2 && palette.Length > 1)
        {
            currentColorIndex = 1;
            currentColor = palette[currentColorIndex];
        }

        UpdateBrushColorVisual();
    }


    void Update()
    {
        if (Input.GetKeyDown(paintKey))
        {
            if (overlappingSource != null && overlappingSource.owner == playerOwner)
            {
                currentColor = overlappingSource.paintColor;
                currentColorIndex = overlappingSource.colorIndex;
                UpdateBrushColorVisual();
                Debug.Log($"Picked up color: index={currentColorIndex}, color={currentColor}");
            }

            if (overlappingTile != null && currentColorIndex >= 0)
            {
                overlappingTile.Paint(currentColor, currentColorIndex);

                if (FindFirstObjectByType<PatternManager>()?.IsPatternMatched() == true)
                {
                    FindFirstObjectByType<GameManagerPainting>()?.EndGame("YOU WON!");
                }
            }
        }
    }


    void OnTriggerEnter(Collider other)
    {
        if (other.TryGetComponent(out WallTile tile))
            overlappingTile = tile;

        if (other.TryGetComponent(out PaintSource source))
            overlappingSource = source;
    }

    void OnTriggerExit(Collider other)
    {
        if (other.TryGetComponent(out WallTile tile) && overlappingTile == tile)
            overlappingTile = null;

        if (other.TryGetComponent(out PaintSource source) && overlappingSource == source)
            overlappingSource = null;
    }

    void UpdateBrushColorVisual()
    {
        if (rend != null)
            rend.material.color = currentColor;

        if (currentColor == Color.clear)
        {
            brushColorUI.color = new Color(255, 255, 255, 255); 
        }
        else
        {
            Color uiColor = currentColor;
            uiColor.a = 1f;
            brushColorUI.color = uiColor;
        }
    }
}
