using UnityEngine;
using System.Collections.Generic;

public class TileSpawner : MonoBehaviour
{
    public TileCatalog catalog;
    public List<TilePlacement> placements;

    private Dictionary<string, GameObject> tileLookup;

    void Awake()
    {
        tileLookup = new Dictionary<string, GameObject>();
        foreach (var tile in catalog.tiles)
        {
            if (string.IsNullOrEmpty(tile.tileName) || tile.prefab == null)
            {
                Debug.LogWarning("TileCatalog contains a tile with missing data.");
                continue;
            }
            tileLookup[tile.tileName] = tile.prefab;
            if (tile.prefab.GetComponent<Collider>() == null)
            {
                tile.prefab.AddComponent<BoxCollider>();
            }
        }

        foreach (var placement in placements)
        {
            if (!tileLookup.TryGetValue(placement.tileName, out var prefab))
            {
                Debug.LogWarning($"Prefab not found for tile name: {placement.tileName}");
                continue;
            }

            Quaternion rot = Quaternion.Euler(Vector3.zero);
            var go = Instantiate(prefab, placement.position, rot, transform);
            go.name = placement.tileName;
            for (int i = 0; i < (placement.rotationEuler.z / 90f); i++)
            {
                go.GetComponent<Tile>().RotateClockwise();
            }
        }
    }

}
