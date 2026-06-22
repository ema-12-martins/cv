using UnityEngine;

public class MugCollision : MonoBehaviour
{
    private bool isBallInMug = false;
    private GameObject currentBall;

    // This method can be called by other scripts to check the status
    public bool IsBallInside(GameObject targetBall)
    {
        return isBallInMug && currentBall == targetBall;
    }

    // Called when this object touches another non-trigger collider
    private void OnCollisionEnter(Collision collision)
    {
        // Optional: if (collision.gameObject.CompareTag("Ball"))
        isBallInMug = true;
        currentBall = collision.gameObject;
    }

    // Called when the objects stop touching
    private void OnCollisionExit(Collision collision)
    {
        if (collision.gameObject == currentBall)
        {
            isBallInMug = false;
            currentBall = null;
        }
    }
}