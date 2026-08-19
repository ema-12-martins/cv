using UnityEngine;

public class WoodPlayerController : MonoBehaviour
{
    public int playerId = 1; // 1 = A/D + E, 2 = Left/Right + Enter
    public float moveSpeed = 3f;
    public float minX = -5f;
    public float maxX = 0f;
    public LogSpawner logSpawner;

    private KeyCode leftKey;
    private KeyCode rightKey;
    private KeyCode cutKey;

    private void Start()
    {
        if (playerId == 1)
        {
            leftKey = KeyCode.A;
            rightKey = KeyCode.D;
            cutKey = KeyCode.E;
        }
        else
        {
            leftKey = KeyCode.LeftArrow;
            rightKey = KeyCode.RightArrow;
            cutKey = KeyCode.Return;
        }
    }

    private void Update()
    {
        float moveDir = 0f;
        if (Input.GetKey(leftKey)) moveDir -= 1f;
        if (Input.GetKey(rightKey)) moveDir += 1f;
        if (Input.GetKeyDown(cutKey))
        {
            TryCut();
        }
        Vector3 newPos = transform.position + Vector3.right * moveDir * moveSpeed * Time.deltaTime;
        newPos.x = Mathf.Clamp(newPos.x, minX, maxX);
        transform.position = newPos;
    }

    void TryCut()
    {
        LogController log = logSpawner.currentLogController;
        if (log != null)
        {
            log.CutAtPosition(transform.position.x, playerId);
        }
    }

    private void OnDrawGizmosSelected()
    {
        Gizmos.color = Color.yellow;
        Gizmos.DrawWireSphere(transform.position, 1f);
    }
}
