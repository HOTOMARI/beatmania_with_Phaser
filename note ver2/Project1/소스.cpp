#include<iostream>
#include<vector>
#include<fstream>
#include<math.h>
using namespace std;

class Note {
public:
	int time{};
	int measure{};
};

int main() {
	vector<Note> notes;
	Note note;
	ofstream out;
	double time = 0;
	int pre_time = 0;
	float bpm;
	int measure;
	int line = 0;
	int count = 1;
	int note_num = 0;

	notes.reserve(1000);

	cout << "bpm �Է�: ";
	cin >> bpm;
	cout << "���۸��� �Է�: ";
	cin >> measure;
	cout << "��Ʈ����: ";
	do {
		cin >> note_num;
	} while (note_num < 0);
	if (note_num > 7)note_num = 6;

	time = 1 / (bpm / 60.0) * (4 * (measure - 1));
	cout << count << ". ���� �ð�: " << time * 1000 << endl;
	note.time = round(time * 1000);
	note.measure = measure;
	for (int i = 0; i < note_num; ++i)
		notes.push_back(note);
	note_num = 0 ;
	count++;

	for (;;) {
		int num;
		cout << "���� �Է�: ";
		do {
			cin >> num;
		} while (num < 4 && num>0);
		switch (num)
		{
			// ���� �ѱ��
			// �������� ó���� �ڵ����� ��Ʈ����
		case -1:
			cout << "��Ʈ����: ";
			do {
				cin >> note_num;
			} while (note_num < 0);
			if (note_num > 7)note_num = 6;
			time = 1 / (bpm / 60.0) * (4 * measure);
			count = 1;
			cout << "---------------------------------------\n";
			cout << "���� ����:" << ++measure << endl;
			cout << count << ". �ð�: " << time * 1000 << endl;
			note.time = time * 1000;
			note.measure = measure;
			for (int i = 0; i < note_num; ++i)
				notes.push_back(note);
			note_num = 0;
			count++;
			break;

		// �������
		case 0:
			out.open("notes.json");

			out << "{\n\"bpm\":" << bpm << ",\n";
			out << "\"minbpm\":" << bpm << ",\n";
			out << "\"maxbpm\":" << bpm << ",\n";

			out << "\"length\":" << 0 << ",\n";

			out << "\"speedTrigger\":1" << ",\n";
			out << "\"speedData\":[\n";
			out << "{\"speed\":1.0" << ",\"time\":0" << "}\n";
			out << "],\n";

			out << "\"noteNum\":" << notes.size() << ",\n";
			out << "\"noteData\":[\n";

			for (Note data : notes) {
				out << "{\"time\":" << data.time << ",\"line\":" << line << ", \"measure\":" << data.measure << "},\n";
				line++;
				line %= 6;
			}

			out << "]\n}\n";

			return 0;
			break;

			// ��Ʈ���
			// ������ ��Ʈ ����� ���� �ѱ��
		default:
			if (num < 0) {
				time = time + (1 / (bpm / 60.0) / (-num / 4));
			}
			else {
				cout << "��Ʈ����: ";
				do {
					cin >> note_num;
				} while (note_num < 0);
				if (note_num > 7)note_num = 6;
				time = time + (1 / (bpm / 60.0) / (num / 4));
				cout << count << ". �ð�: " << time * 1000 << endl;
				note.time = round(time * 1000);
				note.measure = measure;
				for (int i = 0; i < note_num; ++i)
					notes.push_back(note);
				note_num = 0;
				count++;
			}
			break;
		}
	}
}