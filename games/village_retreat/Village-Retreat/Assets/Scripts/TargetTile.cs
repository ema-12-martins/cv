using UnityEngine;

public enum TargetType { White, Orange, Green }


public class TargetTile : MonoBehaviour
{

    public TargetType targetType;
    public Vector2Int gridPos;
    private GridManager gridManager;

    public bool isOccupied; 

    void Start()
    {
        gridManager = FindFirstObjectByType<GridManager>();
        gridPos = new Vector2Int(
            Mathf.RoundToInt(transform.position.x),
            Mathf.RoundToInt(transform.position.z)
        );
    }

    void Update()
    {
        isOccupied = gridManager.potPositions.ContainsKey(gridPos);
    }
}
