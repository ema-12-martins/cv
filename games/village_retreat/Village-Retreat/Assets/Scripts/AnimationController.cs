using UnityEngine;

public class PlayerAnimationController : MonoBehaviour
{
    private Animator animator;

    private void Awake()
    {
        animator = GetComponent<Animator>();
    }

    public void SetWalking(bool isWalking)
    {
        animator.SetBool("isWalking", isWalking);
    }

    public void SetGrounded(bool isGrounded)
    {
        animator.SetBool("isGrounded", isGrounded);
    }

    public void TriggerJump()
    {
        animator.SetTrigger("isJumping");
    }

    // Extra: se quiser resetar o trigger manualmente
    public void ResetJumpTrigger()
    {
        animator.ResetTrigger("isJumping");
    }
}
