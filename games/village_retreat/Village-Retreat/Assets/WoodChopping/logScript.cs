using UnityEngine;
using System.Collections.Generic;
using System.Collections;
using FMODUnity;

public class LogController : MonoBehaviour
{
    public float leftSideL;
    public float leftSideR;
    public float rightSideL;
    public float rightSideR;
    public GameObject cutMarkPrefabL; // visual indicator prefab
    public GameObject cutMarkPrefabR; // visual indicator prefab
    public float cutTolerance = 0.5f;
    public LogSpawner spawner;
    public GameObject cutPrefab;
    private GameObject baseClosed;
    private GameObject baseOpen;

    private List<float> leftCutPoints = new List<float>();
    private List<float> rightCutPoints = new List<float>();

    public string cutSound = "event:/Minigames/Woodchopping/cortar_madeira";
    public string successSound = "event:/Minigames/Success";
    public string failureSound = "event:/Minigames/Failure";
    private FMOD.Studio.EventInstance cutSoundInstance;
    private FMOD.Studio.EventInstance successSoundInstance;
    private FMOD.Studio.EventInstance failureSoundInstance;

    GameObject FindInactiveObjectByName(string name)
    {
        var rootObjects = gameObject.scene.GetRootGameObjects();
        foreach (var root in rootObjects)
        {
            var result = FindInChildren(root.transform, name);
            if (result != null) return result.gameObject;
        }
        return null;
    }

    Transform FindInChildren(Transform parent, string name)
    {
        if (parent.name == name)
            return parent;

        foreach (Transform child in parent)
        {
            var found = FindInChildren(child, name);
            if (found != null)
                return found;
        }

        return null;
    }

    void Start()
    {
        baseClosed = GameObject.Find("base");
        baseOpen = FindInactiveObjectByName("baseOpen");

        if(baseClosed == null)
            Debug.LogError("baseClosed not found!");

        if(baseOpen == null)
            Debug.LogError("baseOpen not found!");

        GenerateCutPoints();
    }

    void GenerateCutPoints()
    {
        // Clear previous
        foreach (Transform child in transform)
        {
            if (child.CompareTag("CutMark"))
                Destroy(child.gameObject);
        }

        leftCutPoints.Clear();
        rightCutPoints.Clear();

        int leftCount = Random.Range(1, 4);
        int rightCount = Random.Range(1, 4);

        float minDistance = 1f;

        // Generate Left Cut Points
        int attempts = 0;
        while (leftCutPoints.Count < leftCount && attempts < 100)
        {
            float x = Random.Range(leftSideL, leftSideR);
            bool tooClose = false;

            foreach (float existing in leftCutPoints)
            {
                if (Mathf.Abs(x - existing) < minDistance)
                {
                    tooClose = true;
                    break;
                }
            }

            if (!tooClose)
            {
                leftCutPoints.Add(x);
                SpawnMarkL(x);
            }

            attempts++;
        }

        // Generate Right Cut Points
        attempts = 0;
        while (rightCutPoints.Count < rightCount && attempts < 100)
        {
            float x = Random.Range(rightSideL, rightSideR);
            bool tooClose = false;

            foreach (float existing in rightCutPoints)
            {
                if (Mathf.Abs(x - existing) < minDistance)
                {
                    tooClose = true;
                    break;
                }
            }

            if (!tooClose)
            {
                rightCutPoints.Add(x);
                SpawnMarkR(x);
            }

            attempts++;
        }
    }


    void SpawnMarkL(float x)
    {
        Quaternion rotation = Quaternion.Euler(90f, 180f, 0f);
        GameObject mark = Instantiate(cutMarkPrefabL, new Vector3(x, 0f, -0.03f), rotation, transform);
        mark.tag = "CutMark";
        mark.transform.localScale = new Vector3(0.045f, 1f, 0.4f);
    }

    void SpawnMarkR(float x)
    {
        Quaternion rotation = Quaternion.Euler(90f, 180f, 0f);
        GameObject mark = Instantiate(cutMarkPrefabR, new Vector3(x, 0f, -0.03f), rotation, transform);
        mark.tag = "CutMark";
        mark.transform.localScale = new Vector3(0.045f, 1f, 0.4f);
    }

    public void CutAtPosition(float x, int playerId)
    {
        cutSoundInstance = RuntimeManager.CreateInstance(cutSound);
        cutSoundInstance.setVolume(0.3f);
        cutSoundInstance.start();
        Quaternion rotation = Quaternion.Euler(90f, 180f, 0f);
        Debug.Log($"Player {playerId} is trying to cut a log!");
        List<float> side = playerId == 1 ? leftCutPoints : rightCutPoints;

        for (int i = 0; i < side.Count; i++)
        {
            if (Mathf.Abs(x - side[i]) < cutTolerance)
            {
                Debug.Log($"Player {playerId} cut a log!");

                GameObject cutMade = Instantiate(cutPrefab, new Vector3(side[i], -2f, -0.015f), rotation, transform);
                cutMade.transform.localScale = new Vector3(0.045f, 1f, 0.988f);

                side.RemoveAt(i);
                CheckFinished();

                return;
            }
        }

        Debug.Log($"Player {playerId} missed the cut!");
        failureSoundInstance = RuntimeManager.CreateInstance(failureSound);
        failureSoundInstance.setVolume(0.3f);
        failureSoundInstance.start();
        GameObject cutMade2 = Instantiate(cutPrefab, new Vector3(x, -2f, -0.015f), rotation, transform);
        cutMade2.transform.localScale = new Vector3(0.045f, 1f, 0.988f);
        spawner.AddScore(-10);

        StartCoroutine(FallAndDestroy());
    }

    void CheckFinished()
    {
        if (leftCutPoints.Count == 0 && rightCutPoints.Count == 0)
        {
            Debug.Log("Log fully chopped!");
            spawner.AddScore(50);
            successSoundInstance = RuntimeManager.CreateInstance(successSound);
            successSoundInstance.setVolume(0.3f);
            successSoundInstance.start();
            // You could start a fall animation or spawn the next log here
            StartCoroutine(FallAndDestroy());
        }
    }

    IEnumerator FallAndDestroy()
    {
        baseClosed.SetActive(false);
        baseOpen.SetActive(true);
        foreach (Transform child in transform)
        {
            if (child.CompareTag("CutMark"))
            {
                child.gameObject.SetActive(false); // Hide the cut mark
            }
        }

        Vector3 startPos = transform.position;
        Vector3 endPos = startPos + new Vector3(0f, -5f, 0f); // fall down 5 units
        float duration = 1.0f;
        float elapsed = 0f;

        while (elapsed < duration)
        {
            transform.position = Vector3.Lerp(startPos, endPos, elapsed / duration);
            elapsed += Time.deltaTime;
            yield return null;
        }

        transform.position = endPos;

        baseClosed.SetActive(true);
        baseOpen.SetActive(false);
        if (spawner != null)
        {
            spawner.SpawnNewLog();
        }

        Destroy(gameObject);
    }
}
