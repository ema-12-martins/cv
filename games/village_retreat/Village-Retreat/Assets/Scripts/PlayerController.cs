using System;
using UnityEngine;

public class PlayerController : MonoBehaviour
{
    public KeyCode up, down, left, right;
    public float moveDelay = 0.1f;
    public float verticalStepSize = 1f;
    public float horizontalStepSize = 1f;

    public Vector2Int currentPos;
    private bool isMoving;

    [SerializeField] private GridManager gridManager;

    void Awake()
    {
        if (gridManager == null)
        {
            gridManager = FindFirstObjectByType<GridManager>();
            Debug.LogWarning($"[PlayerController:{gameObject.name}] Auto-assigned GridManager.");
        }
    }

    void Start()
    {
        StartCoroutine(DelayedInit());
    }

    System.Collections.IEnumerator DelayedInit()
    {
        yield return new WaitUntil(() => gridManager.grid != null);

        Debug.Log($"[PlayerController] Starting on tile: {gridManager.GetTileType(currentPos)}");

        if (!gridManager.IsInBounds(currentPos))
        {
            Debug.LogError("Player starting position is out of bounds!");
            yield break;
        }

        transform.position = GridToWorld(currentPos);
    }


    void Update()
    {
        if (isMoving) return;

        Vector2Int dir = Vector2Int.zero;

        if (Input.GetKeyDown(up)) dir = Vector2Int.up;
        else if (Input.GetKeyDown(down)) dir = Vector2Int.down;
        else if (Input.GetKeyDown(left)) dir = Vector2Int.left;
        else if (Input.GetKeyDown(right)) dir = Vector2Int.right;

        if (dir != Vector2Int.zero){
            TryMove(dir);
        }

        if (Input.GetKeyDown(KeyCode.Space)){
            Debug.Log("All targets covered? " + gridManager.AreAllTargetsCovered());
        }
    }

    void TryMove(Vector2Int direction)
    {
        if (gridManager == null || gridManager.grid == null)
        {
            Debug.LogWarning("Skipping move — GridManager not ready yet.");
            return;
        }

        Vector2Int targetPos = currentPos + direction; 
        Debug.Log($"Trying to move to {targetPos}");
        if (!gridManager.IsInBounds(targetPos)) Debug.LogWarning("Target position is out of bounds!");

        // Is pot in the way?
        if (gridManager.potPositions.ContainsKey(targetPos))
        {
            Vector2Int potTargetPos = targetPos + direction;
            if (gridManager.TryMovePot(targetPos, potTargetPos))
            {
                MoveTo(targetPos); // Move player to where pot was
            }
        }
        else if (gridManager.IsTileWalkable(targetPos))
        {
            MoveTo(targetPos);
        }
    }

    void MoveTo(Vector2Int newPos)
    {
        currentPos = newPos;
        transform.position = GridToWorld(newPos); 
        StartCoroutine(MoveCooldown());
    }

    System.Collections.IEnumerator MoveCooldown()
    {
        isMoving = true;
        yield return new WaitForSeconds(moveDelay);
        isMoving = false;
    }

    Vector3 GridToWorld(Vector2Int gridPos)
    {
        return new Vector3(
            gridPos.x * horizontalStepSize,
            transform.position.y,
            gridPos.y * verticalStepSize
        );
    }
}
