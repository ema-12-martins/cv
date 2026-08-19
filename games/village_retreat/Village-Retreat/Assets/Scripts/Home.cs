using UnityEngine;
using TMPro;
using UnityEngine.SceneManagement;
using FMODUnity;
using FMOD.Studio;

public class Home : MonoBehaviour
{
    public Direction outputDirection;
    public GameObject winPanel;
    public TextMeshProUGUI winMessageText;
    public TextMeshProUGUI countdownText;

    private string winSound = "event:/Minigames/Success";
    private string loseSound = "event:/Minigames/Failure";
    private string endMusic = "event:/Music/minigames/Mini 02";

    private EventInstance instance;

    public void Check()
    {
        Tile target = GetAdjacentTile(outputDirection);
        if (target == null) return;

        Direction reverse = GetOppositeDirection(outputDirection);
        if (!target.HasOpenSide(reverse)) return;

        bool allTilesValid = true;

        foreach (Tile tile in FindObjectsByType<Tile>(FindObjectsSortMode.None))
        {
            if (!tile.IsPowered)
            {
                allTilesValid = false;
                break;
            }
            foreach (Direction dir in tile.openSides)
            {
                Component neighbor = GetConnectableAtDirection(tile.transform.position, dir);
                if (neighbor == null)
                {
                    allTilesValid = false;
                    break;
                }
            }

            if (!allTilesValid) break;
        }
        if (allTilesValid)
        {
            UpdateVisual();
            GlobalVariables.Instance.light = 1;
            Object.FindFirstObjectByType<Timer>().StopTimer();
            FindAnyObjectByType<Timer>().instance.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
            Invoke("winScreen", 3);
        }
    }

    System.Collections.IEnumerator CountdownToNextScene()
    {
        int seconds = 30;
        while (seconds > 0)
        {
            if (countdownText != null)
                countdownText.text = $"Going back to island in {seconds} seconds!";
            yield return new WaitForSeconds(1f);
            seconds--;
        }
        changeScene();
    }

    private void winScreen()
    {
        if (winPanel != null)
        {
            FindAnyObjectByType<TutorialManagerElectrical>().instance.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
            instance = RuntimeManager.CreateInstance(winSound);
            instance.set3DAttributes(RuntimeUtils.To3DAttributes(transform.position));
            instance.setVolume(0.2f);
            instance.start();
            instance.release();
            instance = RuntimeManager.CreateInstance(endMusic);
            instance.set3DAttributes(RuntimeUtils.To3DAttributes(transform.position));
            instance.setVolume(0.05f);
            instance.start();
            instance.release();
            winPanel.SetActive(true);
            if (winMessageText != null) winMessageText.text = "YOU WON!";
            StartCoroutine(CountdownToNextScene());
        }
    }

    public void loseScreen()
    {
        if (winPanel != null)
        {
            FindAnyObjectByType<TutorialManagerElectrical>().instance.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
            FindAnyObjectByType<Timer>().instance.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
            instance = RuntimeManager.CreateInstance(loseSound);
            instance.set3DAttributes(RuntimeUtils.To3DAttributes(transform.position));
            instance.setVolume(0.2f);
            instance.start();
            instance.release();
            instance = RuntimeManager.CreateInstance(endMusic);
            instance.set3DAttributes(RuntimeUtils.To3DAttributes(transform.position));
            instance.setVolume(0.05f);
            instance.start();
            instance.release();
            winPanel.SetActive(true);
            if (winMessageText != null) winMessageText.text = "GAME OVER!";
            StartCoroutine(CountdownToNextScene());
        }
    }

    private void changeScene()
    {
        instance.stop(FMOD.Studio.STOP_MODE.ALLOWFADEOUT);
        if (GlobalVariables.Instance.bush == 1 && GlobalVariables.Instance.wood == 1 && GlobalVariables.Instance.ink == 1 && GlobalVariables.Instance.light == 1) SceneManager.LoadScene("CutScene");
        else SceneManager.LoadScene("Island", LoadSceneMode.Single);
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

    private Component GetConnectableAtDirection(Vector3 position, Direction dir)
    {
        Vector2 offset = DirectionToVector(dir);
        Vector3 targetPos = position + new Vector3(-offset.x, offset.y, 0);  // match tile logic
        Collider[] hits = Physics.OverlapSphere(targetPos, 0.1f);

        foreach (var hit in hits)
        {
            if (hit.TryGetComponent<Tile>(out Tile tile))
            {
                if (tile.HasOpenSide(GetOppositeDirection(dir)))
                    return tile;
            }

            // Check Generator
            Generator gen = hit.GetComponentInParent<Generator>();
            if (gen != null && gen.outputDirection == GetOppositeDirection(dir))
            {
                return gen;
            }

            // Check Home
            Home home = hit.GetComponentInParent<Home>();
            if (home != null && home.outputDirection == GetOppositeDirection(dir))
            {
                return home;
            }
        }
        return null;
    }

    private void UpdateVisual()
    {
        Material Powered = Resources.Load("Materials/Powered", typeof(Material)) as Material;
        foreach (Transform child in transform)
        {
            GameObject childGO = child.gameObject;
            childGO.GetComponent<MeshRenderer>().material = Powered;
        }
    }

    public void SkipToNextScene()
    {
        StopAllCoroutines();
        changeScene();
    }
}
