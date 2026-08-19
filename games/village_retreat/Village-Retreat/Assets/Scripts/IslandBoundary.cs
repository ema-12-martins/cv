using UnityEngine;
using UnityEngine.AI;

public class IslandBoundary : MonoBehaviour
{
    [Header("Configuração")]
    public float checkInterval = 0.3f;  // Verifica a cada 0.3 segundos (performance)
    public float checkRadius = 0.5f;    // Raio de verificação ao redor do jogador

    private NavMeshAgent agent;
    private Vector3 lastSafePosition;

    void Start()
    {
        agent = GetComponent<NavMeshAgent>();
        lastSafePosition = transform.position;
        InvokeRepeating(nameof(CheckBoundary), checkInterval, checkInterval);
    }

    void CheckBoundary()
    {
        if (!IsPositionValid(transform.position))
        {
            Debug.Log("Jogador saiu da ilha! Retornando...");
            agent.Warp(lastSafePosition);
        }
        else
        {
            lastSafePosition = transform.position;
        }
    }

    bool IsPositionValid(Vector3 pos)
    {
        return NavMesh.SamplePosition(pos, out _, checkRadius, NavMesh.AllAreas);
    }
}