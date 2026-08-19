using UnityEngine;
using UnityEngine.InputSystem;

public class InputManager2 : MonoBehaviour
{
    private PlayerInput2 playerInput;
    private PlayerInput2.OnFootActions onFoot;
    private PlayerMotor motor;
    private PlayerLook look;

    private void Awake()
    {
        playerInput = new PlayerInput2();
        onFoot = playerInput.OnFoot;
        motor = GetComponent<PlayerMotor>();
        look = GetComponent<PlayerLook>();
        onFoot.Jump.performed += ctx => motor.Jump(); 
    }
    private void FixedUpdate()
    {
        //Tell playermotor to move based on the actions
        motor.ProcessMove(onFoot.Movement.ReadValue<Vector2>());
    }
    private void LateUpdate()
    {
        //Tell playermotor to move based on the actions
        //look.ProcessLook(onFoot.Look.ReadValue<Vector2>());
    }
    private void OnEnable()
    {
       onFoot.Enable();
    }
    private void OnDisable()
    {
        onFoot.Disable();
    }
}
