using UnityEngine;

public class PatternManager : MonoBehaviour
{
    public ColorPalette palette;
    public WallTile[] tiles;
    public GameObject patternUIPrefab;
    public Transform patternUIParent;

    void Start()
    {
        GeneratePattern();
    }

    public void GeneratePattern()
    {
        for (int i = 0; i < tiles.Length; i++)
        {
            int randomIndex = Random.Range(0, palette.colors.Length);
            tiles[i].targetColorIndex = randomIndex;
            tiles[i].targetColor = palette.colors[randomIndex];
        }
    }

    public bool IsPatternMatched()
    {
        foreach (WallTile tile in tiles)
        {
            if (tile.currentColorIndex != tile.targetColorIndex)
            {
                Debug.Log($"Mismatch on tile {tile.name}: targetIndex={tile.targetColorIndex}, currentIndex={tile.currentColorIndex}");
                return false;
            }
        }
        return true;
    }

    public void ShowPatternUI()
    {
        foreach (WallTile tile in tiles)
        {
            GameObject icon = Instantiate(patternUIPrefab, patternUIParent);
            icon.name = "PatternIcon_" + tile.targetColor;

            if (icon.TryGetComponent<UnityEngine.UI.Image>(out var img))
            {
                Color color = tile.targetColor;
                color.a = 1f;
                img.color = color;
            }
        }

        Debug.Log($"Creating {tiles.Length} pattern icons");
    }

    public void SetTiles(WallTile[] newTiles)
    {
        tiles = newTiles;
        GeneratePattern();
        ShowPatternUI();
    }
}