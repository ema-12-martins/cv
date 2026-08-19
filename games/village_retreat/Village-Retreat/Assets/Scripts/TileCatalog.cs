using UnityEngine;
using System.Collections.Generic;

[CreateAssetMenu(fileName = "TileCatalog", menuName = "Tiles/Tile Catalog")]
public class TileCatalog : ScriptableObject
{
    public List<TileData> tiles;
}
