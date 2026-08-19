using UnityEngine;

public class PlayerLook : MonoBehaviour
{
    public Transform playerBody; // Referência ao corpo do jogador (objeto que roda)
    public Camera cam;

    public float cameraFollowSpeed = 5f; // Controla quão lenta é a câmara

    private float xRotation = 0f;

    void LateUpdate()
    {
        // Interpolar suavemente a rotação Y da câmara para seguir o jogador
        Quaternion targetRotation = Quaternion.Euler(xRotation, playerBody.eulerAngles.y, 0);
        cam.transform.rotation = Quaternion.Lerp(cam.transform.rotation, targetRotation, Time.deltaTime * cameraFollowSpeed);
    }
}
