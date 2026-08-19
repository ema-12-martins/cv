using UnityEngine;

public class SkeletonScript : MonoBehaviour
{
    public string boneName;

    public SkeletonThings skeletonThings;
    
    private MeshRenderer bone;

    private void Start()
    {
        bone = GetComponent<MeshRenderer>();
        UpdateBone();
    }

    private void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Bone"))
        {
            // Assuming there's a PlayerScript with an AddBones method
            BoneScript bone = other.GetComponent<BoneScript>();
            Debug.Log("Comparing " + this.boneName + " with bone: " + bone.boneName);

            if (bone.boneName == this.boneName)
            {
                skeletonThings.CollectBone(bone.boneName);
                UpdateBone();
                other.gameObject.SetActive(false);
            }
        }
    }

    private void UpdateBone()
    {
        if (skeletonThings != null)
            bone.enabled = skeletonThings.IsBoneCollected(boneName);
        else
            Debug.LogError("SkeletonThings reference is missing!" + gameObject.name);
    }
}
