using UnityEngine;

public class ThirdPersonCamera : MonoBehaviour
{
    [SerializeField] private Transform player;
    [SerializeField] private Vector3 offset = new Vector3(0, 2, -5);
    [SerializeField] private float smoothSpeed = 0.1f;

    private void LateUpdate()
    {
        if (player == null) return;

        // Calcular a posição desejada da câmera
        Vector3 desiredPosition = player.position + offset;

        // Suavizar o movimento da câmera
        Vector3 smoothedPosition = Vector3.Lerp(transform.position, desiredPosition, smoothSpeed * Time.deltaTime);
        transform.position = smoothedPosition;

        // Fazer a câmera olhar para o jogador (opcional)
        transform.LookAt(player);
    }
}