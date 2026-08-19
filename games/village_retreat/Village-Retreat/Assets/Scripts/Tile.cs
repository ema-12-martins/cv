using UnityEngine;
using System.Collections;
using FMODUnity;
using FMOD.Studio;

public enum Direction
{
    Up,
    Right,
    Down,
    Left
}

public class Tile : MonoBehaviour
{
    public Direction[] openSides;
    public bool IsPowered { get; private set; }
    private bool isRotating = false;
    public bool WasPoweredLastFrame { get; internal set; }
    private string electricSound = "event:/Minigames/Electricalconnections/Electricity";

    public void SetPowered(bool state, int remainingDepth, bool fromGenerator = false)
    {
        IsPowered = state;

        UpdateVisual();

        if (IsPowered && remainingDepth > 0)
        {
            if (fromGenerator && !WasPoweredLastFrame)
            {
                EventInstance instance = RuntimeManager.CreateInstance(electricSound);
                instance.set3DAttributes(RuntimeUtils.To3DAttributes(transform.position));
                instance.setVolume(0.3f);
                instance.start();
                instance.release();
            }
            PropagateEnergy(remainingDepth - 1);
        }
    }

    private void PropagateEnergy(int remainingDepth)
    {
        foreach (Direction dir in openSides)
        {
            Tile neighbor = GetAdjacentTile(dir);
            if (neighbor == null) continue;

            Direction reverse = GetOppositeDirection(dir);
            if (neighbor.HasOpenSide(reverse))
            {
                neighbor.SetPowered(true, remainingDepth);
            }
        }
    }

    public bool HasOpenSide(Direction dir)
    {
        foreach (var side in openSides)
            if (side == dir) return true;

        return false;
    }

    private Tile GetAdjacentTile(Direction dir)
    {
        Vector2 offset = DirectionToVector(dir);
        Vector3 targetPosition = transform.position + new Vector3(-offset.x, offset.y, 0);
        Collider[] hits = Physics.OverlapSphere(targetPosition, 0.1f);
        foreach (var hit in hits)
        {
            if (hit.GetComponent<Tile>() != null) return hit.GetComponent<Tile>();
        }
        return null;
    }

    private Vector2 DirectionToVector(Direction dir)
    {
        return dir switch
        {
            Direction.Up => Vector2.up,
            Direction.Down => Vector2.down,
            Direction.Left => Vector2.left,
            Direction.Right => Vector2.right,
            _ => Vector2.zero
        };
    }

    private Direction GetOppositeDirection(Direction dir)
    {
        return dir switch
        {
            Direction.Up => Direction.Down,
            Direction.Down => Direction.Up,
            Direction.Left => Direction.Right,
            Direction.Right => Direction.Left,
            _ => dir
        };
    }

    private Direction RotateDirectionClockwise(Direction dir)
    {
        return dir switch
        {
            Direction.Up => Direction.Right,
            Direction.Right => Direction.Down,
            Direction.Down => Direction.Left,
            Direction.Left => Direction.Up,
            _ => dir,
        };
    }

    public bool RotateClockwise()
    {
        if (!isRotating)
        {
            StartCoroutine(RotateSmoothly());
            return true;
        }
        return false;
    }

    private IEnumerator RotateSmoothly()
    {
        isRotating = true;

        Quaternion startRotation = transform.rotation;
        Quaternion endRotation = startRotation * Quaternion.Euler(0, 0, 90f);
        float duration = 0.2f;
        float elapsed = 0f;

        while (elapsed < duration)
        {
            transform.rotation = Quaternion.Slerp(startRotation, endRotation, elapsed / duration);
            elapsed += Time.deltaTime;
            yield return null;
        }

        transform.rotation = endRotation;

        for (int i = 0; i < openSides.Length; i++)
        {
            openSides[i] = RotateDirectionClockwise(openSides[i]);
        }

        isRotating = false;
        FindAnyObjectByType<GameManager>().RefreshEnergy();
    }

    private void UpdateVisual()
    {  
        Material Powered = Resources.Load("Materials/Powered", typeof(Material)) as Material;
        Material Wire = Resources.Load("Materials/Wire", typeof(Material)) as Material;
        foreach (Transform child in transform)
        {
            GameObject childGO = child.gameObject;
            childGO.GetComponent<MeshRenderer>().material = IsPowered ? Powered : Wire;
        }
    }
}
