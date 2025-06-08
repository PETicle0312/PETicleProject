@Entity
@Table(name = "school_students")
@Getter
@Setter
@NoArgsConstructor
public class SchoolStudentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long schoolStudentId;

    private String name;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "student_number")
    private String studentNumber;

    @ManyToOne
    @JoinColumn(name = "school_id")
    private SchoolEntity school;
}
