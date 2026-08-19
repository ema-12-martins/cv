using UnityEngine;
using System.Collections.Generic;
using FMODUnity;


public enum TileType { Empty, Wall, Target, Ground, Water }

public class GridManager : MonoBehaviour
{
    public int width, height;
    public TileType[,] grid;

    public Dictionary<Vector2Int, GameObject> potPositions = new();
    private List<Vector2Int> allTargets = new();
    public EventReference successSound;
    public EventReference failSound;

    void Awake()
    {
        InitializeGrid();
        FindAllTargets();
        RegisterAllPots(); 
        // OnDrawGizmos();
    }

    public TargetTile FindTargetAtPosition(Vector2Int pos)
    {
        foreach (TargetTile target in FindObjectsByType<TargetTile>(FindObjectsSortMode.None))
        {
            if (target.gridPos == pos)
                return target;
        }
        return null;
    }

    public bool AreAllTargetsCovered()
    {
        foreach (TargetTile target in FindObjectsByType<TargetTile>(FindObjectsSortMode.None))
        {
            if (!potPositions.ContainsKey(target.gridPos)) return false;

            GameObject potObj = potPositions[target.gridPos];
            Pot pot = potObj.GetComponent<Pot>();
            if (pot == null) return false;

            if (!DoesPotMatchTarget(pot.potType, target.targetType))
                return false;
        }
        return true;
    }

    public bool DoesPotMatchTarget(PotType pot, TargetType target)
    {
        return (pot == PotType.LightGreen && target == TargetType.White)
            || (pot == PotType.DarkGreen && target == TargetType.Orange)
            || (pot == PotType.White && target == TargetType.Green);
    }

    void FindAllTargets()
    {
        allTargets.Clear();
        for (int x = 0; x < width; x++)
        {
            for (int y = 0; y < height; y++)
            {
                if (grid[x, y] == TileType.Target)
                    allTargets.Add(new Vector2Int(x, y));
            }
        }
    }

    void RegisterAllPots()
    {
        Pot[] potsInScene = FindObjectsByType<Pot>(FindObjectsSortMode.None); 
        foreach (Pot pot in potsInScene)
        {
            Vector2Int pos = new(Mathf.RoundToInt(pot.transform.position.x), Mathf.RoundToInt(pot.transform.position.z));
            potPositions[pos] = pot.gameObject;
        }
    }


    void InitializeGrid()
    {
        grid = new TileType[width, height];

        grid[7, 0] = TileType.Wall;
        grid[8, 0] = TileType.Wall;
        grid[9, 0] = TileType.Wall;
        grid[10, 0] = TileType.Wall;
        grid[11, 0] = TileType.Wall;
        grid[12, 0] = TileType.Wall;
        grid[13, 0] = TileType.Wall;
        grid[14, 0] = TileType.Wall;
        grid[15, 0] = TileType.Wall;
        grid[16, 0] = TileType.Wall;

        grid[7, 1] = TileType.Wall;
        grid[8, 1] = TileType.Water;
        grid[9, 1] = TileType.Ground;
        grid[10, 1] = TileType.Ground;
        grid[11, 1] = TileType.Ground;
        grid[12, 1] = TileType.Ground;
        grid[13, 1] = TileType.Target;
        grid[14, 1] = TileType.Ground;
        grid[15, 1] = TileType.Ground;
        grid[16, 1] = TileType.Wall;

        grid[7, 2] = TileType.Wall;
        grid[8, 2] = TileType.Ground;
        grid[9, 2] = TileType.Ground;
        grid[10, 2] = TileType.Ground;
        grid[11, 2] = TileType.Wall;
        grid[12, 2] = TileType.Ground;
        grid[13, 2] = TileType.Wall;
        grid[14, 2] = TileType.Wall;
        grid[15, 2] = TileType.Ground;
        grid[16, 2] = TileType.Wall;

        grid[7, 3] = TileType.Wall;
        grid[8, 3] = TileType.Ground;
        grid[9, 3] = TileType.Ground;
        grid[10, 3] = TileType.Ground;
        grid[11, 3] = TileType.Ground;
        grid[12, 3] = TileType.Ground;
        grid[13, 3] = TileType.Ground;
        grid[14, 3] = TileType.Ground;
        grid[15, 3] = TileType.Ground;
        grid[16, 3] = TileType.Wall;

        grid[7, 4] = TileType.Wall;
        grid[8, 4] = TileType.Ground;
        grid[9, 4] = TileType.Ground;
        grid[10, 4] = TileType.Wall;
        grid[11, 4] = TileType.Ground;
        grid[12, 4] = TileType.Ground;
        grid[13, 4] = TileType.Ground;
        grid[14, 4] = TileType.Water;
        grid[15, 4] = TileType.Target;
        grid[16, 4] = TileType.Wall;

        grid[7, 5] = TileType.Wall;
        grid[8, 5] = TileType.Wall;
        grid[9, 5] = TileType.Ground;
        grid[10, 5] = TileType.Target;
        grid[11, 5] = TileType.Wall;
        grid[12, 5] = TileType.Target;
        grid[13, 5] = TileType.Ground;
        grid[14, 5] = TileType.Water;
        grid[15, 5] = TileType.Ground;
        grid[16, 5] = TileType.Wall;

        grid[7, 6] = TileType.Wall;
        grid[8, 6] = TileType.Ground;
        grid[9, 6] = TileType.Ground;
        grid[10, 6] = TileType.Ground;
        grid[11, 6] = TileType.Ground;
        grid[12, 6] = TileType.Wall;
        grid[13, 6] = TileType.Ground;
        grid[14, 6] = TileType.Ground;
        grid[15, 6] = TileType.Ground;
        grid[16, 6] = TileType.Wall;

        grid[7, 7] = TileType.Wall;
        grid[8, 7] = TileType.Ground;
        grid[9, 7] = TileType.Ground;
        grid[10, 7] = TileType.Ground;
        grid[11, 7] = TileType.Ground;
        grid[12, 7] = TileType.Ground;
        grid[13, 7] = TileType.Ground;
        grid[14, 7] = TileType.Ground;
        grid[15, 7] = TileType.Ground;
        grid[16, 7] = TileType.Wall;

        grid[7, 8] = TileType.Wall;
        grid[8, 8] = TileType.Ground;
        grid[9, 8] = TileType.Wall;
        grid[10, 8] = TileType.Wall;
        grid[11, 8] = TileType.Ground;
        grid[12, 8] = TileType.Wall;
        grid[13, 8] = TileType.Wall;
        grid[14, 8] = TileType.Ground;
        grid[15, 8] = TileType.Ground;
        grid[16, 8] = TileType.Wall;

        grid[7, 9] = TileType.Ground;
        grid[8, 9] = TileType.Ground;
        grid[9, 9] = TileType.Ground;
        grid[10, 9] = TileType.Ground;
        grid[11, 9] = TileType.Ground;
        grid[12, 9] = TileType.Ground;
        grid[13, 9] = TileType.Ground;
        grid[14, 9] = TileType.Wall;
        grid[15, 9] = TileType.Ground;
        grid[16, 9] = TileType.Wall;

        grid[7, 10] = TileType.Wall;
        grid[8, 10] = TileType.Ground;
        grid[9, 10] = TileType.Ground;
        grid[10, 10] = TileType.Wall;
        grid[11, 10] = TileType.Target;
        grid[12, 10] = TileType.Ground;
        grid[13, 10] = TileType.Ground;
        grid[14, 10] = TileType.Ground;
        grid[15, 10] = TileType.Ground;
        grid[16, 10] = TileType.Wall;

        grid[7, 11] = TileType.Wall;
        grid[8, 11] = TileType.Ground;
        grid[9, 11] = TileType.Ground;
        grid[10, 11] = TileType.Wall;
        grid[11, 11] = TileType.Wall;
        grid[12, 11] = TileType.Wall;
        grid[13, 11] = TileType.Wall;
        grid[14, 11] = TileType.Wall;
        grid[15, 11] = TileType.Wall;
        grid[16, 11] = TileType.Wall;

        grid[7, 12] = TileType.Wall;
        grid[8, 12] = TileType.Wall;
        grid[9, 12] = TileType.Wall;
        grid[10, 12] = TileType.Wall;
        grid[11, 12] = TileType.Empty;
        grid[12, 12] = TileType.Empty;
        grid[13, 12] = TileType.Empty;
        grid[14, 12] = TileType.Empty;
        grid[15, 12] = TileType.Empty;
        grid[16, 12] = TileType.Empty;

        grid[0, 0] = TileType.Empty;
        grid[1, 0] = TileType.Empty;
        grid[2, 0] = TileType.Empty;
        grid[3, 0] = TileType.Empty;
        grid[4, 0] = TileType.Empty;
        grid[5, 0] = TileType.Empty;
        grid[6, 0] = TileType.Empty;

        grid[0, 1] = TileType.Empty;
        grid[1, 1] = TileType.Empty;
        grid[2, 1] = TileType.Empty;
        grid[3, 1] = TileType.Empty;
        grid[4, 1] = TileType.Empty;
        grid[5, 1] = TileType.Empty;
        grid[6, 1] = TileType.Empty;

        grid[0, 2] = TileType.Empty;
        grid[1, 2] = TileType.Empty;
        grid[2, 2] = TileType.Empty;
        grid[3, 2] = TileType.Empty;
        grid[4, 2] = TileType.Empty;
        grid[5, 2] = TileType.Empty;
        grid[6, 2] = TileType.Empty;

        grid[0, 3] = TileType.Empty;
        grid[1, 3] = TileType.Empty;
        grid[2, 3] = TileType.Empty;
        grid[3, 3] = TileType.Empty;
        grid[4, 3] = TileType.Empty;
        grid[5, 3] = TileType.Empty;
        grid[6, 3] = TileType.Empty;

        grid[0, 4] = TileType.Empty;
        grid[1, 4] = TileType.Empty;
        grid[2, 4] = TileType.Empty;
        grid[3, 4] = TileType.Empty;
        grid[4, 4] = TileType.Empty;
        grid[5, 4] = TileType.Empty;
        grid[6, 4] = TileType.Empty;

        grid[0, 5] = TileType.Wall;
        grid[1, 5] = TileType.Wall;
        grid[2, 5] = TileType.Wall;
        grid[3, 5] = TileType.Wall;
        grid[4, 5] = TileType.Wall;
        grid[5, 5] = TileType.Wall;
        grid[6, 5] = TileType.Empty;

        grid[0, 6] = TileType.Wall;
        grid[1, 6] = TileType.Ground;
        grid[2, 6] = TileType.Ground;
        grid[3, 6] = TileType.Target;
        grid[4, 6] = TileType.Ground;
        grid[5, 6] = TileType.Wall;
        grid[6, 6] = TileType.Empty;

        grid[0, 7] = TileType.Wall;
        grid[1, 7] = TileType.Water;
        grid[2, 7] = TileType.Ground;
        grid[3, 7] = TileType.Wall;
        grid[4, 7] = TileType.Ground;
        grid[5, 7] = TileType.Wall;
        grid[6, 7] = TileType.Empty;

        grid[0, 8] = TileType.Wall;
        grid[1, 8] = TileType.Ground;
        grid[2, 8] = TileType.Ground;
        grid[3, 8] = TileType.Ground;
        grid[4, 8] = TileType.Ground;
        grid[5, 8] = TileType.Wall;
        grid[6, 8] = TileType.Wall;

        grid[0, 9] = TileType.Wall;
        grid[1, 9] = TileType.Ground;
        grid[2, 9] = TileType.Ground;
        grid[3, 9] = TileType.Ground;
        grid[4, 9] = TileType.Ground;
        grid[5, 9] = TileType.Ground;
        grid[6, 9] = TileType.Ground;

        grid[0, 10] = TileType.Wall;
        grid[1, 10] = TileType.Ground;
        grid[2, 10] = TileType.Target;
        grid[3, 10] = TileType.Wall;
        grid[4, 10] = TileType.Target;
        grid[5, 10] = TileType.Wall;
        grid[6, 10] = TileType.Wall;

        grid[0, 11] = TileType.Wall;
        grid[1, 11] = TileType.Ground;
        grid[2, 11] = TileType.Ground;
        grid[3, 11] = TileType.Ground;
        grid[4, 11] = TileType.Ground;
        grid[5, 11] = TileType.Wall;
        grid[6, 11] = TileType.Empty;

        grid[0, 12] = TileType.Wall;
        grid[1, 12] = TileType.Wall;
        grid[2, 12] = TileType.Wall;
        grid[3, 12] = TileType.Wall;
        grid[4, 12] = TileType.Wall;
        grid[5, 12] = TileType.Wall;
        grid[6, 12] = TileType.Empty;

    }

    public bool IsTileWalkable(Vector2Int pos)
    {
        if (!IsInBounds(pos)) return false;
        if (grid[pos.x, pos.y] == TileType.Wall) return false;
        if (potPositions.ContainsKey(pos)) return false; 
        return true;
    }

    public bool TryMovePot(Vector2Int from, Vector2Int to)
    {
        if (!potPositions.ContainsKey(from)) return false;
        if (!IsTileWalkable(to)) return false;

        GameObject pot = potPositions[from];
        potPositions.Remove(from);
        potPositions[to] = pot;

        pot.transform.position = new Vector3(to.x, pot.transform.position.y, to.y);

        TileType tileType = GetTileType(to);
        if (tileType == TileType.Target)
        {
            TargetTile target = FindTargetAtPosition(to);
            Pot potComponent = pot.GetComponent<Pot>();

            if (target != null && potComponent != null)
            {
                var gameManager = GameManagerZenGarden.Instance;
                if (DoesPotMatchTarget(potComponent.potType, target.targetType))
                {
                    var instance = RuntimeManager.CreateInstance(successSound);
                    instance.setVolume(0.3f); 
                    instance.set3DAttributes(RuntimeUtils.To3DAttributes(transform.position));
                    instance.start();
                    instance.release();
                    if (!gameManager.alreadyScored.Contains(to))
                    {
                        if (potComponent.potType == PotType.White && target.targetType == TargetType.Green)
                        {
                            float currentTime = Time.time;
                            gameManager.whiteOnGreenTimes.Add(currentTime);
                            gameManager.whiteOnGreenTimes.RemoveAll(t => currentTime - t > 1f);

                            int bonusCount = gameManager.whiteOnGreenTimes.Count;

                            if (bonusCount >= 2)
                            {
                                gameManager.AddScore(50);
                                gameManager.ShowFeedback("Synced Pots Bonus!");
                            }
                            else
                            {
                                gameManager.AddScore(10);
                            }
                        }
                        else
                        {
                            gameManager.AddScore(10);
                        }
                        gameManager.alreadyScored.Add(to);
                    }
                }
                else
                {
                    var instance = RuntimeManager.CreateInstance(failSound);
                    instance.setVolume(0.5f); 
                    instance.set3DAttributes(RuntimeUtils.To3DAttributes(transform.position));
                    instance.start();
                    instance.release();
                    gameManager.SubtractScore(5);
                    gameManager.ShowFeedback("Wrong pot on target!");
                }
            }
        }

        return true;
    }

    public bool IsInBounds(Vector2Int pos)
    {
        return pos.x >= 0 && pos.y >= 0 && pos.x < width && pos.y < height;
    }

    public TileType GetTileType(Vector2Int pos)
    {
        return IsInBounds(pos) ? grid[pos.x, pos.y] : TileType.Wall;
    }
    
    void OnDrawGizmos()
    {
        if (grid == null) return;

        for (int x = 0; x < width; x++)
        {
            for (int y = 0; y < height; y++)
            {
                Vector3 pos = new Vector3(x, 0, y);
                    Gizmos.color = grid[x, y] switch
                    {
                        TileType.Wall => Color.red,
                        TileType.Target => Color.green,
                        TileType.Ground => Color.white,
                        TileType.Water => Color.cyan,
                        _ => Color.gray,
                    };
                    Gizmos.DrawCube(pos + Vector3.up * 0.1f, Vector3.one * 0.9f);
            }
        }
    }
}
