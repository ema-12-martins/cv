using UnityEngine;

public class PlayerControllerPaiting : MonoBehaviour
{
    public float speed = 5f;
    public string horizontal = "Horizontal";
    public string vertical = "Vertical";

    void Update()
    {
        float h = Input.GetAxisRaw(horizontal);
        float v = Input.GetAxisRaw(vertical);

        Vector3 move = new Vector3(h, v, 0).normalized;
        transform.position += speed * Time.deltaTime * move;
    }

}
