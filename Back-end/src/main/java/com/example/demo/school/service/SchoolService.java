@Service
@RequiredArgsConstructor
public class SchoolService {

    private final SchoolRepository schoolRepository;
    private final SchoolStudentRepository studentRepository;

    public List<String> searchSchool(String keyword) {
        return schoolRepository.findBySchoolNameContaining(keyword)
                .stream()
                .map(SchoolEntity::getSchoolName)
                .collect(Collectors.toList());
    }

    public boolean verifyStudent(StudentVerifyDto dto) {
        return studentRepository.findByStudentNumberAndSchool_SchoolName(dto.getStudentNumber(), dto.getSchoolName())
                .map(student -> student.getName().equals(dto.getName()))
                .orElse(false);
    }
}
