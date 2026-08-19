using System.Collections.Generic;
using UnityEngine;

public class ShelfZone : MonoBehaviour
{
    // A list to track objects currently in this shelf
    public List<GameObject> objectsInZone = new List<GameObject>();

    private void OnTriggerEnter(Collider other)
    {
        // If an object enters and isn't already in the list, add it
        if (other.attachedRigidbody != null && !objectsInZone.Contains(other.gameObject))
        {
            objectsInZone.Add(other.gameObject);
        }
    }

    private void OnTriggerExit(Collider other)
    {
        // If an object leaves, remove it from the list
        if (objectsInZone.Contains(other.gameObject))
        {
            objectsInZone.Remove(other.gameObject);
        }
    }

    // Helper function for the Game Director to call
    public bool ContainsObject(GameObject obj)
    {
        return objectsInZone.Contains(obj);
    }
}