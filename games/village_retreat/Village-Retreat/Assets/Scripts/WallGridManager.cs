using UnityEngine;

public class WallGridManager : MonoBehaviour
{
    public GameObject tilePrefab;
    public int width = 10;
    public int height = 10;
    public float spacing = 1.1f;
    public PatternManager patternManager; 
    public float Ytranslation = 0f; 

    void Start()
    {
        WallTile[] tiles = new WallTile[width * height];
        int index = 0;

        for (int y = 0; y < height; y++)
        {
            for (int x = 0; x < width; x++)
            {
                Vector3 pos = new(x * spacing, y * spacing + Ytranslation, 0.05f);
                GameObject tileGO = Instantiate(tilePrefab, pos, Quaternion.identity, transform);

                WallTile tile = tileGO.GetComponent<WallTile>();
                tiles[index] = tile;
                index++;
            }
        }

        if (patternManager != null)
        {
            patternManager.SetTiles(tiles);
        }
    }
}
