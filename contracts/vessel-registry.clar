;; Vessel Registry Contract
;; Stores information about registered fishing vessels

(define-data-var admin principal tx-sender)

;; Data structure for vessel information
(define-map vessels
  { vessel-id: uint }
  {
    name: (string-utf8 100),
    owner: principal,
    capacity: uint,
    registration-date: uint,
    is-active: bool
  }
)

;; Keep track of the next available vessel ID
(define-data-var next-vessel-id uint u1)

;; Check if caller is admin
(define-private (is-admin)
  (is-eq tx-sender (var-get admin))
)

;; Register a new vessel
(define-public (register-vessel
                (name (string-utf8 100))
                (owner principal)
                (capacity uint))
  (let ((vessel-id (var-get next-vessel-id)))
    (asserts! (is-admin) (err u403))
    (asserts! (> capacity u0) (err u400))

    (map-insert vessels
      { vessel-id: vessel-id }
      {
        name: name,
        owner: owner,
        capacity: capacity,
        registration-date: block-height,
        is-active: true
      }
    )

    (var-set next-vessel-id (+ vessel-id u1))
    (ok vessel-id)
  )
)

;; Update vessel status (active/inactive)
(define-public (update-vessel-status (vessel-id uint) (is-active bool))
  (let ((vessel-data (unwrap! (map-get? vessels { vessel-id: vessel-id }) (err u404))))
    (asserts! (or (is-admin) (is-eq tx-sender (get owner vessel-data))) (err u403))

    (map-set vessels
      { vessel-id: vessel-id }
      (merge vessel-data { is-active: is-active })
    )
    (ok true)
  )
)

;; Get vessel information
(define-read-only (get-vessel (vessel-id uint))
  (map-get? vessels { vessel-id: vessel-id })
)

;; Check if vessel exists and is active
(define-read-only (is-vessel-active (vessel-id uint))
  (match (map-get? vessels { vessel-id: vessel-id })
    vessel-data (get is-active vessel-data)
    false
  )
)

;; Transfer vessel ownership
(define-public (transfer-ownership (vessel-id uint) (new-owner principal))
  (let ((vessel-data (unwrap! (map-get? vessels { vessel-id: vessel-id }) (err u404))))
    (asserts! (is-eq tx-sender (get owner vessel-data)) (err u403))

    (map-set vessels
      { vessel-id: vessel-id }
      (merge vessel-data { owner: new-owner })
    )
    (ok true)
  )
)

;; Set a new admin
(define-public (set-admin (new-admin principal))
  (begin
    (asserts! (is-admin) (err u403))
    (var-set admin new-admin)
    (ok true)
  )
)
