using UnityEngine;

public class PlayerMotor : MonoBehaviour
{
    private CharacterController controller;
    private Vector3 playerVelocity;
    private bool isGrounded;

    public float jumpHeight = 0.1f;
    public float speed = 15f;
    public float gravity = -9.8f;
    public float groundCheckDistance = 0.5f; // Distância para verificar o chão à frente

    private PlayerAnimationController animController;

    private void Start()
    {
        controller = GetComponent<CharacterController>();
        animController = GetComponent<PlayerAnimationController>();
    }

    private void Update()
    {
        isGrounded = controller.isGrounded;
        animController.SetGrounded(isGrounded);
    }

    public void ProcessMove(Vector2 input)
    {
        // Movimento para frente e para trás
        Vector3 moveDirection = new Vector3(0, 0, input.y);
        Vector3 worldMove = transform.TransformDirection(moveDirection);
        Vector3 moveAmount = worldMove * speed * Time.deltaTime;

        // Verifica se há chão na posição futura antes de mover
        bool canMove = CheckGroundAhead(moveAmount);

        // Roda o jogador com o eixo X (A/D) - a rotação não precisa de verificação
        transform.Rotate(Vector3.up * input.x * speed * 15f * Time.deltaTime);

        // Animações e movimento
        bool isWalking = moveDirection.magnitude > 0.1f && canMove;
        animController.SetWalking(isWalking);

        // Aplica movimento apenas se houver chão à frente
        if (canMove)
        {
            controller.Move(moveAmount);
        }

        // Gravidade
        if (isGrounded && playerVelocity.y < 0)
        {
            playerVelocity.y = -2f;
        }

        playerVelocity.y += gravity * Time.deltaTime;
        controller.Move(playerVelocity * Time.deltaTime);
    }

    private bool CheckGroundAhead(Vector3 moveAmount)
    {
        // Se não está se movendo, considera que pode mover (para ficar parado)
        if (moveAmount.magnitude < 0.001f) return true;

        // Calcula posição futura
        Vector3 futurePosition = transform.position + moveAmount;

        // Lança raycast para baixo a partir da posição futura
        if (Physics.Raycast(futurePosition + Vector3.up * 0.1f, Vector3.down, out RaycastHit hit, groundCheckDistance + 0.1f))
        {
            return true; // Tem chão à frente
        }

        return false; // Não tem chão à frente
    }

    public void Jump()
    {
        if (isGrounded)
        {
            playerVelocity.y = Mathf.Sqrt(jumpHeight * -1.5f * gravity);
            animController.TriggerJump();
        }
    }
}